Here is the corrected and well-formatted description in a Markdown file:

---

# Project Setup Instructions

To run the project, follow these steps:

1. **Install Root Dependencies**:
   - Run `npm i` in the root of the project. This will install the `concurrently` package.

   ```sh
   npm install
   ```

2. **Install Frontend and Backend Dependencies**:
   - Run `npm run preinstall`. `Concurrently` will trigger the dependencies installation for both the frontend and backend parts.

   ```sh
   npm run preinstall
   ```

3. **Create Environment Files**:
   - In the `frontend` and `backend` folders, create `.env` files and add the following environment variables.

   For the **frontend** `.env` file:

   ```env
   REACT_APP_OPENTOK_API_KEY="API_KEY_HERE"
   ```

   For the **backend** `.env` file:

   ```env
   OPENTOK_API_KEY="API_KEY_HERE"
   OPENTOK_API_SECRET="SECRET_KEY_HERE"
   ```

4. **Start the Project**:
   - In the root folder, run the start script to launch the project.

   ```sh
   npm run start
   ```

---