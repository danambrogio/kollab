CREATE TABLE IF NOT EXISTS `settings` (
  `id`        BIGINT NOT NULL AUTO_INCREMENT,
  `key`       VARCHAR(200) NOT NULL,
  `value`     VARCHAR(200) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `key` (`key`)
);

INSERT INTO `settings` (`key`, `value`) VALUES ('db_version', '1');

CREATE TABLE IF NOT EXISTS `users` (
  `id`           BIGINT       NOT NULL AUTO_INCREMENT,
  `username`     VARCHAR(20)  NOT NULL,
  `passHash`     CHAR(128)    NOT NULL,
  `passSalt`     VARCHAR(20)  NOT NULL,
  `email`        VARCHAR(50)  NOT NULL,
  `creationDate` DATETIME     NOT NULL,
  `isActive`     TINYINT      NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS `userpreferences` (
  `id`        BIGINT      NOT NULL AUTO_INCREMENT,
  `userId`    BIGINT      NOT NULL,
  `theme`     INT         NOT NULL,
  `timeZone`  VARCHAR(64) NOT NULL,

  PRIMARY KEY(id),
  FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `tasks` (
  `id`                  BIGINT       NOT NULL AUTO_INCREMENT,
  `title`               VARCHAR(100) NOT NULL,
  `description`         VARCHAR(200),
  `status`              INT          NOT NULL,
  `creationDate`        DATETIME     NOT NULL,
  `estimatedCompletion` DATETIME,
  `completionDate`      DATETIME,
  `tags`                VARCHAR(100),
  PRIMARY KEY(id)
);