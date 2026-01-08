const { OpenAI } = require('openai');
const botChats = require('../models/botChats.js');
const {
  sendJsonResponse,
  checkForMissingKeysInObject,
} = require('../utils/helpers.js');

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

const openAIAssistantID = process.env.OPEN_AI_ASSISTANT_ID;

const getChatThreads = async (request, response) => {
  try {
    let { chatIds } = request.query;

    // Parse chatIds from query if needed
    if (typeof chatIds === 'string') {
      chatIds = JSON.parse(chatIds);
    }

    if (!Array.isArray(chatIds) || chatIds.length === 0) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.BAD_REQUEST,
        false,
        'Invalid chat IDs provided!',
        null,
      );
    }

    // Fetch chats based on chat IDs
    const chatThreads = await botChats
      .find({ _id: { $in: chatIds } })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    if (!chatThreads || chatThreads.length === 0) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.NOTFOUND,
        false,
        'No chat threads found!',
        null,
      );
    }

    return sendJsonResponse(
      response,
      HTTP_STATUS_CODES.OK,
      true,
      'Success',
      chatThreads,
    );
  } catch (error) {
    return sendJsonResponse(
      response,
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      false,
      'Error occurred!',
      {
        error: error.message || error,
      },
    );
  }
};

const createChatThread = async (request, response) => {
  try {
    const payload = request.body;

    // Check for missing fields in payload
    const missingFields = checkForMissingKeysInObject(payload, ['message']);
    if (missingFields) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.BAD_REQUEST,
        false,
        `Missing Parameters: ${missingFields.join(', ')}`,
        null,
      );
    }

    if (!openAIAssistantID) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        false,
        'Assistant is Not Live!',
        null,
      );
    }

    if (payload?.thread) {
      // Try to find the existing thread directly and update if found
      const dbPayload = await botChats.findOneAndUpdate(
        { thread: payload?.thread },
        {
          $push: {
            messages: { message: payload.message, reply: null },
          },
        },
        { new: true },
      );

      // If the thread exists, we return the updated payload
      if (dbPayload) {
        return sendJsonResponse(
          response,
          HTTP_STATUS_CODES.OK,
          true,
          'Message added to existing chat',
          dbPayload,
        );
      }
    }

    // Create a new OpenAI thread and save it to the database if the thread was not found or provided
    const newThread = await openai.beta.threads.create();
    if (!newThread?.id) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        false,
        'Failed to create thread',
        null,
      );
    }
    // Save the new thread with the message
    const dbPayload = await botChats.create({
      title: payload?.message?.slice(0, 100),
      thread: newThread.id,
      messages: [{ message: payload.message, reply: null }],
    });

    return sendJsonResponse(
      response,
      HTTP_STATUS_CODES.OK,
      true,
      'New thread created successfully',
      dbPayload,
    );
  } catch (error) {
    console.error(error);
    return sendJsonResponse(
      response,
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      false,
      'Server Error!',
      {
        error: error.message || error,
      },
    );
  }
};

const generateSummarizedChatTitle = async (userMessage, botReply) => {
  try {
    const prompt = `please generate a short 4 to 5 words summarized Title for chat. user ask this to ${userMessage} here is query reply ${botReply}.`;

    completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 100,
    });

    if (completion?.choices[0]?.message?.content) {
      return completion;
    } else {
      return 'title Generation::Failure';
    }
  } catch (error) {
    console.error('Error creating assistant:', error);
  }
};

const sendMessageInThread = async (request, response) => {
  try {
    const payload = request.body;

    // Check for missing fields in payload
    const missingFields = checkForMissingKeysInObject(payload, ['messageID']);
    if (missingFields) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.BAD_REQUEST,
        false,
        `Missing Parameters: ${missingFields.join(', ')}`,
        null,
      );
    }

    // Find thread and specific message using only messageID
    const threadFound = await botChats.findOne({
      'messages._id': payload?.messageID,
    });

    if (!threadFound) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.NOTFOUND,
        false,
        'Thread or message not found',
        null,
      );
    }

    // Locate the specific message
    const specificMessage = threadFound.messages.find(
      (message) => message._id.toString() === payload.messageID,
    );

    if (!specificMessage) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.NOTFOUND,
        false,
        'Message not found in the thread',
        null,
      );
    }

    if (!openAIAssistantID) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        false,
        'Assistant is Not Live!',
        null,
      );
    }

    // Send user message to OpenAI
    await openai.beta.threads.messages.create(threadFound.thread, {
      role: 'user',
      content: `Here is the query from Tourist: ${specificMessage.message}`,
    });

    // Set response headers for a streaming response
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');

    let aiMessageContent = '';

    const retryLimit = 3; // retry up to 3 times
    let attempt = 0;
    let streamError = false;

    const startStreaming = () => {
      openai.beta.threads.runs
        .stream(threadFound.thread, {
          assistant_id: openAIAssistantID,
          instructions: `Please address the user as Tourist`,
        })
        .on('textDelta', (textDelta) => {
          aiMessageContent += textDelta.value; // Accumulate response content
          response.write(textDelta.value);
        })
        .on('end', async () => {
          let summarizedChatTitle = await generateSummarizedChatTitle(
            specificMessage?.message,
            aiMessageContent,
          );

          summarizedChatTitle =
            summarizedChatTitle?.choices?.[0]?.message?.content || null;
          threadFound.title = summarizedChatTitle;

          await threadFound.save();

          await botChats.findOneAndUpdate(
            { 'messages._id': payload.messageID },
            {
              $set: {
                'messages.$.reply': aiMessageContent,
              },
            },
            { new: true },
          );
          response.write(`\n`);
          response.end();
        })
        .on('error', (error) => {
          if (attempt < retryLimit) {
            attempt++;
            console.warn(`Retrying streaming... Attempt ${attempt}`);
            startStreaming(); // Retry the stream
          } else {
            console.error('Error in stream:', error);
            streamError = true;
            response.write(`data: [ERROR] Stream failed\n\n`);
            response.end();
          }
        });
    };

    startStreaming();

    if (streamError) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        false,
        'Streaming Error',
        null,
      );
    }
  } catch (error) {
    return sendJsonResponse(
      response,
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      false,
      'Server Error!',
      {
        error: error.message || error,
      },
    );
  }
};

const deleteChatThread = async (request, response) => {
  try {
    const { chatID } = request.query;

    // Check for missing fields in payload
    const missingFields = checkForMissingKeysInObject(request.query, [
      'chatID',
    ]);
    if (missingFields) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.BAD_REQUEST,
        false,
        `Missing Parameters: ${missingFields.join(', ')}`,
        null,
      );
    }

    // Find the chat thread
    const chatToDelete = await botChats.findOne({ _id: chatID });
    if (!chatToDelete) {
      return sendJsonResponse(
        response,
        HTTP_STATUS_CODES.NOTFOUND,
        false,
        'Chat not found or access denied!',
      );
    }

    await botChats.deleteOne({ _id: chatToDelete._id });

    return sendJsonResponse(
      response,
      HTTP_STATUS_CODES.OK,
      true,
      'Thread deleted successfully',
      chatToDelete,
    );
  } catch (error) {
    return sendJsonResponse(
      response,
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      false,
      'Error occurred!',
      {
        error: error.message || error,
      },
    );
  }
};

module.exports = {
  createChatThread,
  getChatThreads,
  sendMessageInThread,
  deleteChatThread,
};
