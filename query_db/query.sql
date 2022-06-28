CREATE TABLE users (
    idUser VARCHAR(120) NOT NULL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    password VARCHAR(120) NOT NULL,
    phonenumber NUMERIC NOT NULL,
    role VARCHAR(64),
    image VARCHAR(200)
);

CREATE TABLE recipe (
    idrecipe INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(120) NOT NULL,
    ingredients TEXT NOT NULL,
    image VARCHAR(240),
    video VARCHAR(240)
);