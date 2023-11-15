# COMP-333-HW4
## 1. Setup:
Ensure that you have node and npm installed.
To check, run: 
```bash
node -v
```
If you dont have node navigate to [here](https://sebastianzimmeck.de/teaching/comp333/comp333.html), download on 'React Tutorial,' and open "react_install_instructions.pdf".
Follow the instructions to install node.

Make sure to have [xcode](https://developer.apple.com/xcode/) or [andriod studio](https://developer.android.com/studio) downloaded. We would suggest to use andriod studio as that is what was used during development.

Now clone this repository.
## 2. Development
### Backend
- Download xxamp
- Start the MySql Database and Apache web server from manager-osx which comes with xxamp.
- Go into the htdocs folder within xxamp directory and drag this projects 'backend' folder into htdocs.
- Once your servers have started navigate to http://localhost/phpmyadmin and set up your database to these specifications:
  - Your database, which you should call music_db, should contain the following two tables:
<img width="587" alt="Screenshot 2023-10-31 at 1 54 25 PM" src="https://github.com/JustinCasler/COMP-333-HW3/assets/97986810/448836bb-e3cd-4bfd-a492-5e54ece73838">

  - The id attribute in the ratings table is just an integer that is consecutively increased by one as a tuple (row) is being added. Incrementing should be done via MySQLs autoincrement (AI) feature accessible via phpMyAdmin.
  - You can use the varchar(255) type for username, password, song, and artist. You can use int(11) and int(1) and type for id and rating.
  - You can paste this command into the sql tab in the phpMyAdmin to create these tables.
```sql
CREATE TABLE `users` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `song` varchar(255) NOT NULL,
  `rating` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```
### App

cd into the project and run
```bash
npm install
```
to install all necessary dependencies. 

open andriod studio (or xcode) start an Android emulator (Pixel 5, Android API 31), then 

run
```bash
npx expo start 
```

in the terminal a message like : Metro waiting on exp://`{ip-address}` should pop up. (Or the same ip address can be found in the wifi details of whatever network you are currently using).
1. Create a .env file in the main directory
2. Follow the .env.example file as a template, and paste the ip-address given in the terminal into the .env file so that it reads: `EXPO_PUBLIC_API_URL = http://{ip-address-of-emulator}/backend/index.php`

I have found that not including the port in the ip-address-of-emulator works best.

press a to open app on the emulator. 

## 3. Problem #2
We choose to add sorting functionality which can be used on the song overview page of our app. 


## 4. Citations:
1. @react-native-picker/picker: icons
2. @react-navigation: navigation
3. dotenv: enviroment file
4. ChatGPT: Used to help with styling  
