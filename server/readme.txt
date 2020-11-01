Hi Zhao,

It was great speaking to you earlier. Congratulations on passing this part of the Toptal developer screening process.

The second developer interview evaluates your skills via a take-home project. You will find the project requirements in this email. Please treat this project as if you are delivering it to a client.

The requirements for the test project are:
Write an application for managing savings deposits

User must be able to create an account and log in.
When logged in, a user can enter savings deposits, and edit and delete deposits they entered.
Implement at least three roles with different permission levels: a regular user would only be able to CRUD on their owned records, a user manager would be able to CRUD users, and an admin would be able to CRUD all records and users.
A saving deposit is identified by a bank name, account number, an initial amount saved (currency in USD), start date, end date, interest percentage per year and taxes percentage.
The interest could be positive or negative. The taxes are only applied over profit.
User can filter saving deposits by the amount (minimum and maximum), bank name and date.
User can generate a revenue report for a given period, that will show the gains and losses from interest and taxes for each deposit. The amount should be green or red if respectively it represents a gain or loss. The report should show the sum of profits and losses at the bottom of that period. 
The computation of profit/loss is done on a daily basis. Consider that a year is 360 days. 
REST API. Make it possible to perform all user actions via the API, including authentication.
In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
If it’s a web application, it must be a single-page application. All actions need to be done client-side using AJAX, refreshing the page is not acceptable.
Functional UI/UX design is needed. You are not required to create a unique design, however, do follow best practices to make the project as functional as possible.
Bonus: unit and e2e tests.
Please use this private repository to version-control your code:
https://git.toptal.com/screening/zhao-songxun 
Username: songxunzhao1991@gmail.com 
Password: AKDFqas6gqpUE

Helpful take-home project guidelines:

• This project will be used to evaluate your skills and should be fully functional without any obvious missing pieces. We will evaluate the project as if you were delivering it to a customer.
• The deadline to submit your completed project is 2 weeks from the date you received the project requirements.
• If you schedule your final interview after the 2-week deadline, make sure to submit your completed project and all code to the private repository before the deadline. Everything that is submitted after the deadline will not be taken into consideration.
• Please do not commit any code at least 12 hours before the meeting time so that it can be reviewed. Anything that is submitted after this time will not be taken into consideration.
• Please join the meeting room for this final interview on time. If you miss your interview without providing any prior notice, your application may be paused for six months.

Please schedule an interview time that is most suitable for you. Bear in mind that you will need to show a finished project during this interview.

Once you pick an appointment time, we’ll email you with additional meeting details and the contact details of another senior developer from our team who will assess your project and conduct your next interview. They are acting as your client for this project and are your point of contact for any questions you may have during the development of this project.

Thanks,
Lyubomir
