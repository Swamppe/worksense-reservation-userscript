# worksense-reservation-userscript
Violentmonkey script to streamline seat reservations in Optimaze Worksense
Streamlines seat reservation by adding a button to reserve for one week.
Will overwrite anyone else's reservation on the seat. With great power comes great responsibility.

# how do
- Install violentmonkey
- Install script from https://raw.githubusercontent.com/Swamppe/worksense-reservation-userscript/main/main.js
- Copy your identity cookie into the script so it can make reservations on your behalf.
    - Open your browser's inspector tool.
    - Examine any request made to worksense.optimaze.net domain.
    ![image](https://user-images.githubusercontent.com/25839453/222119812-2273f1d6-b07c-47f9-a92b-ee6c02714fd8.png)
    - Copy the value of your "Cookie" header.
    ![image](https://user-images.githubusercontent.com/25839453/222120340-687a3b24-cc42-47f6-b212-9c2261707885.png)
    - Paste it into the identity cookie field.
    ![image](https://user-images.githubusercontent.com/25839453/222121026-0e225041-42f9-4585-bd7e-be3c48eae16a.png)
    
- Open the seat you want to reserve and click on one week.
