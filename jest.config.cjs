module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // Isso diz ao Jest: "Transforme o Faker, mas ignore o resto dos node_modules"
    '/node_modules/(?!(@faker-js/faker)/)',
  ],
  testEnvironment: 'node',
};