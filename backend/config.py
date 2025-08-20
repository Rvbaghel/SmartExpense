class Config:
    SECRET_KEY = 'a-very-long-and-random-string-that-is-not-easy-to-guess'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/salarymanagement'
    SQLALCHEMY_TRACK_MODIFICATIONS = False