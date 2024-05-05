# Destination Recommendation System

### What this product is
This [application](https://destination-recommender-gamma.vercel.app/) recommends you locations to go along with specific places within the region wih information from a survey.
You can also see past results from yourself/other individuals by going to '/results'.

Check out the [demo](https://www.loom.com/share/dde76eeb9c254662bae812ad3f9a91d9?sid=9a8d917d-1b34-44a8-8fa2-a530481dbebd).

## Technologies
1. React (JavaScript)
2. FastAPI (Python)
3. Supabase - Postgres
4. Anthropic
5. Vercel - Hosting
6. Render - Hosting
   
## How it works
1. Once you fill out the form on your desired characteristics
   a. Temperature
   b. Climate
   c. Activities to Do
   d. Geographical Location and proximity
2. It gets sent to Anthropic which sends back an ideal location and coordinates.
3. The application saves it to the Postgres db hosted with Supabase and renders the location details on the page.
4. It then sends a get request to the corresponding rapidAPI after parsing the coordinates and determines a list of nearby tourist attractions.
5. To obtain the prior search results, the application makes a get request to the Postgres db and grabs the recent ones.

## How To Use It

You can **clone** this repository.

For the **frontend**, you can install the dependencies with **npm install**.
You should then create an .env with the variable 'REACT_APP_BASE_URL' and change it to the url of the backend.
Then start the application with  **npm start**.

For the **backend**, please install the dependencies via **pip install -r requirements.txt**.
Then, create an env file with the following variables:
  DATABASE_URL="" - for database connection, add db connection url
  ANTHROPIC_API_KEY="" - for anthropic, add api key
  CORS_ORIGIN="" - for cors list, add the frontend url
  PLACES_API="" - for [rapidAPI](https://rapidapi.com/trueway/api/trueway-places/) api, add api key 

Then to start the application, please run **python main.py**

