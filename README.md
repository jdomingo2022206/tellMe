# Overview
This project do all wathever is suposed to do.

> **Note:** The **tellMe** was inspired by the `myspace` forum.
>
> [<img src="https://forum.huawei.com/enterprise/api/file/v1/small/thread/667229096909869056.jpg?appid=esc_es" width="300" height="200">](URL_del_Enlace)


## How run the project?

1. Install node dependencies
```
nmp i dependence_name
```
2.  Install execution environment
```
npm i --save-dev nodemon
```

3. Import data to MongoDB from 
```
./tellMe/configs/data
```

4. Import thunder connection from 
```
./tellMe/configs/thunder_cnn
```
5. Run project 
```
  npm run dev
```

## Create Token

> These are the "default credentials" to generate your token


|Role            |User                           |Email                         |Pass                         |
|----------------|-------------------------------|-----------------------------|-----------------------------|
|Admin           |`'admin'`                      |`'admin1@kinal.edu.gt'`      |`'adm'`                      |
|User			 |`'user'`                       |`'user1@kinal.edu.gt'`       |`'uss'`                      |



Remember set your variables creating your .env file The variables you should create are:

-   PORT
-   JWT_SECRET





