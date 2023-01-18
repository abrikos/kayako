use kayako;
alter table swuseremails add column isAdmin INT not null;
alter table swuseremails add column userpassword varchar(255) not null;
alter table tokens add column access_token varchar(255) not null;
alter table tokens add column refresh_token varchar(255) not null;