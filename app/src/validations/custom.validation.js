const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }

  return value;
};

const getMessages = (label, type) => {
  let errors = {
    'any.required': `${label} अनिवार्य छ`,
  };

  if (type === 'string')
    errors = {
      ...errors,
      'string.base': `${label} अक्षरमा हुनुपर्छ`,
      'string.email': `${label} वास्तविक ईमेल हुनुपर्छ`,
      'string.empty': `${label} खाली पठाउन मिल्दैन`,
      'string.length': `${label} {{#limit}} वटा अक्षरको हुनुपर्छ`,
      'string.max': `${label} {{#limit}} वटा अक्षरभन्दा कम वा बाराबर हुनुपर्छ`,
      'string.min': `${label} {{#limit}} कम्तिमा पनि अक्षरको हुनुपर्छ`,
    };
  else if (type === 'number') {
    errors = {
      ...errors,
      'number.base': `${label} अंक हुनुपर्छ`,
      'number.greater': `${label} {{#limit}} अंकभन्दा बडी हुनुपर्छ`,
      'number.integer': `${label} पूर्णांक हुनुपर्छ`,
      'number.less': `${label} {{#limit}} अंकभन्दा कम हुनुपर्छ`,
      'number.max': `${label} {{#limit}} अंकभन्दा कम वा बाराबर हुनुपर्छ`,
      'number.min': `${label} {{#limit}} अंकभन्दा बडी वा बाराबर हुनुपर्छ`,
      'number.positive': `${label} सकारात्मक अंक हुनुपर्छ`,
    };
  } else if (type === 'boolean') errors = { ...errors, 'boolean.base': `${label} हो/होइन मध्य छान्नुहोस` };

  return errors;
};

module.exports = {
  objectId,
  password,
  getMessages,
};
