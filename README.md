


![Staff](https://staff-ironhack.herokuapp.com/static/media/logo.8fdaa260.svg)



## Description

Film Trails allows to find spots by location where movies or tv shows were filmed. The user can also upload spots to the site.

Staff is a toolkit for the human resource managers, that help them to have all the info of their employees organized.


## User Stories

-  **404:** As a user I want to know if a page that I tried to access exist.
-  **Signup:** As a human resource manager you can create an admin account.
-  **Login:** As a human resource manager or as an emloyee you can enter in the private area.
-  **Logout:** As an user you can close my session.
-  **Add employee** As an human resource manager you can add a new employee to my company.
-  **Delete employee** As an human resource manager you can remove an employee from my company.
-  **Update employee** As a human resource manager you can update the information of the employees, their access account and their photos.
-  **Search employee** As a user you can search by keyword any employee.
-  **View employee** As an employee you can view the profesional information of your colleges.
-  **Add a team** As a human resource manager you can create teams, select the team leader and select the members of the team.
-  **Remove a team** As a human resource manager you can delete teams.
-  **Update company** As a human resource manager you can update the team information.


## Backlog

- Stats section
- Use populate in all models
- Transform into component the add and edit employee form.

  
# Client

## Routes
| Method | Path | Component | Permissions | Behavior | 
|--------|------|--------|--| -------|
| `get` | `/` | Login | public | login form, link to signup, redirect to /employees after login |
| `get` | `/signup` | Signup| public| link to login, redirect to /employees after signup |
| `get` | `/logout` | n/a| public | redirect to login |
| `get` | `/employees` | Employees| user | shows list of employees and allow search |
| `get` | `/employee/add` | EmployeesAdd| admin | allow the admin add new employees and upload a photo |
| `get` | `/employee/edit/:id` | EmployeesEdit| user or admin | show the admin a update form |
| `get` | `/employee/view/:id` | EmployeesView| user | show the user a profile view |
| `get` | `/company` | Company| admin | show the admin an update employee form |
| `get` | `/teams` | Teams| admin | show a list of all teams with the thumbnails of a few employees of each team |
| `get` | `/teams/add` | TeamAdd| admin | Allow the admin to create new teams, and asign a team leader and some members |
| `get` | `/teams/edit/:id` | TeamEdit| admin | allow the admin update a team |
| `get` | `/stats` | Stats| admin | just a landing by the moment 
| `get` | `**` | Page404 | public | 


## Components

- Navbar
  - NavBarMenu

- Topbar

- Login

- Signup

- Company

- Employees

- EmployeesAdd

- EmployeesEdit

- EmployeesView

- Stats

- Teams
  - TeamTable
    - TeamItem

- TeamAdd
  - SeletEmployeeTable
    - SelectEmployeeItem

- TeamEdit
  - SeletEmployeeTable
    - SelectEmployeeItem

- Page404



## Services


- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()

- Company Service
  - companyUpdate(user)
  - companyView(id)
  - imageUpload(file)


- Employee Service
  - employeesList()
  - employeeAdd(user)
  - employeeView(id)
  - employeeUpdate(user)
  - employeeDelete(id)
  - imageUpload(file)

- Team Service
  - teamList()
  - teamAdd(team)
  - teamView(id)
  - teamUpdate(user)
  - teamDelete(id)

# Server

## Models

User model
```
username - String
password - String
name - String
surname - String
title - String
companyPhone - String
dateStart - String
birthDate - String
gender - String
nationality - String
phone - String
photo - String
identificationNumber - String
socialSecurityNumber - String
address - String
city - String
postalCode - String
province - String
country - String
emergencyContact - String
emergencyPhone - String
managerID - String
companyID - String
isAdmin - Boolean
imageUrl - String
```


Company model
```
tradeName - String
corporateName - String
taxIdNumber - String
address - String
city - String
postalCode - Number
province - String
country - String
userAdminId - String
imageUrl - String
```


Team model
```
name - String
usersIds - [{ type: Schema.Types.ObjectId, ref:"User"}]
teamLeaderid - String
companyId - String
mission - String
vision - String
```


## API Endpoints (backend routes)


- POST /auth/signup
  - 401 if user logged in
  - body:
    - username
    - password
    - name
    - surname
    - corporateName
  - validation
    - check if user exist (422)
  - create user with encrypted password
  - store user in session
  - return 200 with user object and isAdmin: true
  - create a new company with the user as an admin
  - return 200 with the user object


- POST /auth/login
  - 401 if user logged in
  - body:
    - username
    - password
  - validation
    - user exists (404)
    - password matches (404)
  - store user in session
  - 200 with user object



- POST /auth/logout
  - body: (empty)
  - 204



- GET /employee
  - get the session user
  - with the companyid of the user get the company info
  - return a 200 with the list of employees of that company


- POST /employee/add
  - body:
  - username
  - password
  - name
  - surname
  - title
  - companyPhone
  - dateStart
  - birthDate
  - gender
  - nationality
  - phone
  - identificationNumber
  - socialSecurityNumber
  - address
  - city
  - postalCode
  - province
  - country
  - emergencyContact
  - emergencyPhone
  - managerID
  - imageUrl
  - validation
    - check if the username exist
    - if exist return a 200 with userExists: true
  - create user with encrypted password
  - store user in session
  - save it and return 200 with the user object


- POST /employee/view/:id
  - Params: 
    - id
  - Session: 
    - CompanyID
  - Validation:
    - Check if the employee to view is in the same company of the user of the session
    - Return a 200 with the user object
    - Or return a 200 with permissions: false


- GET /edit/:id
  - Params:
    - id
  - Session:
    - id
    - companyID
    - isAdmin
  - Validation
    - check if the user is admin
      - check if the user to edit is in the company he is admin
      - return a 200 with the user
      - or return a 200 with permissions: false
    - If is not an admin, check if is the user himself trying to edit his profile
      - return a 200 with the user
    - return a 200 with permissions: false


- PUT /edit/:id
  - Params:
    - id
  - body:
    - username
    - password
    - name
    - surname
    - title
    - companyPhone
    - dateStart
    - birthDate
    - gender
    - nationality
    - phone
    - identificationNumber
    - socialSecurityNumber
    - address
    - city
    - postalCode
    - province
    - country
    - emergencyContact
    - emergencyPhone
    - managerID
    - imageUrl
  - validation
    - check if is the admin of that company or the user himself
    - check the user to edit
    - check if the user exist if the username is been changed
  - create user with encrypted password if it is changed
  - return a 200 with the user


- DELETE /employee/delete/:id
  - Params:
    - id
  - check if is the admin of that company  


- POST /employee/image
  - Upload a photo to cloudinary


- GET /company
  - Session:
    - id
  - Body:
    - tradeName
    - corporateName
    - taxIdNumber
    - address
    - city
    - postalCode
    - province
    - country
  - show the info of the company of the userAdminId 200


- PUT /company
  - Session:
    - id
  - Body:
    - tradeName
    - corporateName
    - taxIdNumber
    - address
    - city
    - postalCode
    - province
    - country
  - update he info of the company of the userAdminId 200


- POST /company/image
  - Upload the logo to cloudinary


- GET /team/list
  - Session:
    - id
  - Validation
    - get the company with the userAdminID
    - check the permissions to see the team
    - populate with the users of the team
    - return the teams and his users 200
    - or return a 200 with canViewList: false
  
- POST /team/new
  - Session:
    - id
  - Body:
    - name
    - usersIds
    - teamLeaderid
    - mission
    - vision  
  - check the admin of the company from the session
  - check the permissions to create a team
  - create a new team object with the companyId from the session
  - save the team and return a 200
  - or return a 200 with canCreate: false


- GET /team/view/:id
  - Session:
    - id
  - Params:
    - id
  - Validation
    - check the admin of the company from the session
    - get the team to view
    - return a 200 with the team info
    - or return a 200 with canView: false


- DELETE /team/delete/:id
  - Session:
    - id
  - Params:
    - id
    - Body:
    - name
    - usersIds
    - teamLeaderid
    - mission
    - vision  
  - Validation
    - check the admin of the company from the session
    - delete the team
    - or return a 200 with canDelete: false


- PUt /team/edit
  - Session:
    - id
  - Params:
    - id
  - Validation
    - check the admin of the company from the session
    - delete the team
    - or return a 200 with canDelete: false


## Links

### Trello/Kanban

[Trello board](https://trello.com/b/BLn0CsCx/staff)

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/Fabionunez/staff-front)
[Server repository Link](https://github.com/Fabionunez/staff-back)

[Deploy Link](https://staff-ironhack.herokuapp.com)

### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1Iy5UzkjVc-4k4QRMX7yQ6QJFifXiKckxPhjhqowOQtI/edit?usp=sharing)