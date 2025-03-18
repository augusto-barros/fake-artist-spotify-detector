# Fake Spotify Artist Detector

A web application that detects potential fake or AI-generated artists by analyzing Spotify data, Wikipedia presence, and Instagram profiles.

## Getting Started

This project is built with [Next.js](https://nextjs.org). Follow these steps to run the development server:

npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Features
- Fetch artist details from Spotify.
- Verify artist presence on Wikipedia.
- Retrieve Instagram profile data.
- Analyze and score artists using OpenAI.

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
- `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` for Spotify API.
- `OPENAI_API_KEY` for OpenAI integration.
- `APIFY_TOKEN` for Instagram profile scraping.

## Learn More

To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## License
MIT License
