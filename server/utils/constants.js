global.EXPRESS_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
};

global.LOGIN_TOKEN_PREFERENCES = {
  expiresIn: '7d',
  algorithm: 'RS256',
};

global.IMAGE_SIZES_TO_UPLOAD = {
  xs: 150,
  s: 300,
  m: 800,
  l: 1280,
  xl: 1920,
  xxl: 2560,
};
global.FILE_UPLOAD_SCHEMA = {
  xs: String,
  s: String,
  m: String,
  l: String,
  xl: String,
  xxl: String,
  original: String,
  mimetype: String,
};

global.HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOTFOUND: 404,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  INVALID_TOKEN: 498,
  INTERNAL_SERVER_ERROR: 500,
};

global.STRIPE_EVENTS = {
  SESSION_COMPLETED: 'checkout.session.completed',
  PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  PAYMENT_FAILED: 'invoice.payment_failed',
};

global.USER_FIELDS_UPDATE_BY_ADMIN_ONLY = [
  'reviews',
  'subscription.paymentID',
  'subscription.activationDate',
  'subscription.expiryDate',
  'subscription.paymentType',
  'subscription.paymentStatus',
  'subscription.isActive',
  'passwordReset',
  // "userRole",
  'isActive',
  'createdBy',
  'updatedBy',
];

global.GUESTS_PHOTOGRAPHERS_IGNORED_FIELDS = {
  password: 0,
  createdBy: 0,
  updatedBy: 0,
  passwordReset: 0,
  isActive: 0,
  'reviews.given': 0,
  'subscription.paymentID': 0,
  'subscription.activationDate': 0,
  'subscription.expiryDate': 0,
  'subscription.duration': 0,
  'subscription.paymentType': 0,
  'subscription.paymentStatus': 0,
  'subscription.paymentType': 0,
  'subscription.cancelation': 0,
  'subscription.paymentType': 0,
};

global.GUESTS_PRODUCTS_IGNORED_FIELDS = {
  isActive: 0,
  createdBy: 0,
  updatedBy: 0,
};

global.GUESTS_GENERAL_IGNORED_FIELDS = {
  isActive: 0,
  createdBy: 0,
  updatedBy: 0,
  createdAt: 0,
  updatedAt: 0,
};

global.RETURNS_WORDS = [
  'Tip Income',
  'Tax exempt interest',
  'Taxable Interest',
  'IRA Distributions Received',
  'Pension/annuity payments received',
  'Taxable Income',
  'Child tax credits or credits for other dependents',
  'Amount Owed',
  'Gross Income',
  'Car and truck expenses',
  'Contract labor ',
  'Depreciation and section 179 expense deduction',
  'Repairs and maintenance',
  'Supplies',
  'Travel',
  'Deductible meals',
  'Other expenses',
  'Expenses for use of your home',
  'Gross income/receipts',
  'Cost of goods sold',
  'Salaries and wages',
  'Guaranteed payments to partners',
  'Rent',
  'Interest',
  'Depreciation',
  'Gross receipts or sales',
  'Cost of goods sold',
  'Gross profit',
  'Interest',
  'Gross rents',
  'Compensation of officers',
  'Salaries and wages',
  'Repairs and maintenance',
  'Bad debts',
  'Rents',
  'Charitable contributions',
  'Depreciation',
  'Advertising',
];
