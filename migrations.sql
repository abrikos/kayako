use kayako;
alter table swuseremails add column isAdmin INT not null;
alter table swuseremails add column userpassword varchar(255) not null;
alter table tokens add column access_token varchar(255) not null;
alter table tokens add column refresh_token varchar(255) not null;
ALTER TABLE `swuseremails` ADD `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `userpassword`;
ALTER TABLE `swuseremails` ADD `blocked` BOOLEAN NOT NULL DEFAULT true AFTER `userpassword`;
UPDATE `swuseremails` SET `blocked` = '0' WHERE `swuseremails`.`email` = 'admin@test.com';
