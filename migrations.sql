use kayako;
ALTER TABLE `swuseremails` ADD `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `userpassword`;
ALTER TABLE `swuseremails` ADD `blocked` BOOLEAN NOT NULL DEFAULT true AFTER `userpassword`;
UPDATE `swuseremails` SET `blocked` = '0' WHERE `swuseremails`.`email` = 'admin@test.com';
