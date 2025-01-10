# Frontend - Expense Tracking Dynamic Web Application

## Prerequisites
Before running the frontend application, make sure you have the following installed:
- **Node.js**: Version 14.x or higher (Download from [here](https://nodejs.org/))
- **Yarn**: To install Yarn, run `npm install -g yarn`.

## Setup
1. Clone the repository to your local machine.
    ```bash
    git clone <your-repository-url>
    cd <your-project-folder>
    ```

2. Install the dependencies.
    ```bash
    yarn install
    ```

## Running the Application
1. After installing the dependencies, you can start the development server using:
    ```bash
    yarn dev
    ```

2. Open your browser and visit `http://localhost:3000` to view the application.

## Features
- View a summary of your expenses categorized by type (Groceries, Transportation, etc.).
- Hover over the amount of each category to view detailed information about individual expenses.
- Daily totals are calculated and displayed for each date.
- Set a monthly spending limit for each category (Groceries, Transportation, etc.).
- Alerts for exceeding spending limits in any category.

## Technologies Used
- **Frontend Framework**: Next.js
- **State Management**: Redux Toolkit
- **Styling**: Raw CSS (No CSS libraries used)
- **Database**: Data visualization is connected to a MongoDB backend via API calls.

## Known Issues
- The tooltip sometimes doesn't display the full list of expenses if the content is too long.
- Some edge cases might arise when data is missing or malformed, though the app tries to handle such cases gracefully.
- The app is not optimized for mobile devices as of now.

## Limitations
- The app only works with the data format defined in the backend. Any deviation from this format might cause issues.
- No CSS libraries are used, and the app is styled purely using raw CSS.

## Troubleshooting
- If you encounter issues with the tooltip, check that the content being displayed doesn’t exceed the maximum allowed width in the frontend CSS.
- Ensure the backend API is running correctly as this app is dependent on live data to function properly.

## Folder Structure
- `/components` - Contains React components used for rendering the UI.
- `/pages` - Next.js pages (including main page, error handling, etc.).
- `/redux` - Contains Redux Toolkit slices for managing state (expenses, limits, etc.).
- `/styles` - Contains CSS files for styling the application.
- `/utils` - Contains helper functions for API integration and utility functions.

## How to Contribute
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -am 'Add new feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.
