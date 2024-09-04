import 'server-only';

import { initializeApp, getApps, cert } from 'firebase-admin/app';

const firebaseAdminConfig = {
  credential: cert({
    projectId: 'api-client-17877',
    clientEmail:
      'firebase-adminsdk-91c2y@api-client-17877.iam.gserviceaccount.com',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCRkspVd7MaY4T4\nhPiQw+piMW9MZFkUCz9EGqT/4ekW4PqKg3Jrb/l1sB95ftmYlMzLutSUoqYSokVJ\nIQHetL2/23fRJFIuKOjwdelV6Ul8lPezKCXwtfEgtYot2wz/CucWryt0tdSny6Je\nKhmEObCa7JlxBX5Q3QGIEAWmMTWTupVjKFeYvlQKQp79y++CjZBT0dqpsoj44IqW\n74HtfyzS1cVJ+uHyy+LGVUcuDEzY+NObzLEXIB0M5RIIjRbWp7upy/jHOEQ/KBDw\nT3QJTkj8QAHboT2a7apYhWH8bvu3nUz06IsFL5NsMMBNb86cgu3ztK+4iPgzgC2f\nLTkaAJ1VAgMBAAECggEADNuOxHrEln2YxoyUGdE8F/0uy+wHFCakKWNDFJjDCjLH\n3kka55Nl0LfEJ+qE1J278vinAxPUoEu12+4u6JlFMzdyv0W6fno9jNOVTvHCfF75\n+9h9dWPUjuOJ91/kJ3iyjYXeTDotNL7fMfr88vlXeG+SY/GsxP6oPnjPzuyEw23y\n25JAVqErAU3WYg3+S9jH8zdxjv4SDJ593z/eSZMr2AEH6PGy1HOnTHn0ntyiE49Q\nBOiEpqvHUrikppkxgDewVj1tLZqtNB62z8LMwV1v+gshBivHXkhn/XG6pPRGlMMO\nmMiMC4pQuCX0rU4GOo2JNQsPmoq8uaWQMlZ+HBEVVwKBgQDGZvHnDPuZceImeqBj\nCf4u4hXeLMfyFt/Yh5lXQZIu45KI/L4Vhl2ukVU4vlW9UuJenewtoo7c5aezABb5\n8J3SW4k6lb5RzNOxc1K1Xm0+sq6Hbe1+gusM2jcS2EaBfz83RFvmjYnzW1Y4MC8J\nDtGSvqR6hSwMADQ2t8EVkAaj5wKBgQC71apK6krqbSzlOUZKKWSOnvAHFTOaojSY\nPlwisP3NH7ekJQJuQrRQBOps/7NVvAaZPzf9OONVZ1ikWJU+SvmtmrFr0lp9MP1o\nBl6G5EaAMZfjUYRbYmhdxVg733UHyOQHPCQlF/497kiYShEYUX1yLdIQd3o7gIYm\nc26vIm+NYwKBgDz9FEuEUCthOLW/aGJJhht/YF2FwokGwxTayiZqf7duOXNmzj/r\nqAyrnFjvGYgzXGbdgOaeW/BHoH+D/YwjjUBG5y5dLb4Tite3rasXNdnaL5BuGF2V\nfQ/cXKWsWjAgn5wrpVyAEfH/F8f599t+9Kl5dTI8kce2oFZZsj8goQntAoGACwF5\n+OnBefrrpoK0m6PRQIoPhlq3q1fVvRXqUB4OwPYazINeoRdHeWjQU5Kn714VBOWv\nYibzKw3jI74NAJlkB8gInUi2BJ/aOT4mS8EUYG6Hd8pO9wvNEbF+egOd19bthX8A\nnyvIudg8aK/uUH512zrUFCLsBpCBS793vMtHvgECgYBUjYvRE/EhhAevBB6AQnOp\nfgVF5I2vSh0zmINqTiNomDA6tQHBTLVLXR5yoahg9OM3ay9upMAeusX0vjHIaOWE\nQwIwcEtO6HhuUunlNvo4TqOtHqZ494fjJOHk2Ud5elxXuK8L539HfF1Lz16a+LD2\nB21ycRs3a08waz5lpfDBmg==\n-----END PRIVATE KEY-----\n',
  }),
};

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}
