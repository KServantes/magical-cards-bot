<h1 align='center'>
    <br>
    <a href='https://github.com/KServantes'><img src="https://i.imgur.com/ebtLbkK.png" alt='magical hats'></a>
    <br>
    <p align='center' style='font: small-caps 34px MatrixBox'>
        Magical Cards Bot
    </p>
</h1>

<h2 align='center'> A Database Maker for EDOPro </h2>

Magical Cards Bot is a Discord.js v14 bot to help **mobile** users create, edit, and view EDOPro compatible databases (.cdb).

For those times you're on the go and had an idea for a custom card come to mind.

##### 🧰 Prerequisites

- [Node.js](https://nodejs.org/en/) v18 or higher
- [Git](https://git-scm.com/downloads)

##### ⛐ Getting Started

Running the bot yourself is easy!

- Open the terminal and run these commands

```
    git clone https://github.com/KServantes/magical-cards-bot.git
    cd magical-cards-bot
    npm i
```

- Type `touch .env`. Add and fill these values
```
    TOKEN=
    CLIENT_ID=
    GUILD_ID=
```

- Type `npm run deploy` to deploy the commands
- Type `npm run migrate` to create the bot's global database
- Type `npm run start` to start the bot

If you need any extra help, you're outta luck until I finish the bot and make an actual guide lol

##### 📟 Commands

Not complete but mostly carried over from v13 of the bot.

* [x] Ping - Responds with "pong", the websocket ping, or Discord API's latency.
* [ ] Avatar - Displays the avatar of yourself or another member.
* [ ] Library - Allows you to *view*, *edit*, and **export** any previously recorded cards made with MCB. This can be global, server-wide, or a person's card database.
* [ ] Create - Takes you through the phases necessary to make your card. This is a multi-phase process. You can save, edit, and delete your card application anytime throughout. The bot will usually DM you to create your cards but you can opt to allow for social card making.
* [ ] Admin - Only viewable by the server admin and constituents. In case they need to clean up or remove cards from the server card pool.
    

##### 🚧 Roadmap

The ambitious features I want to add to the bot soon are...

- Create "Image" - Creates placeholder images to accompany your cards. This is implemented in v13. The ability to import a full card image or just an image for the placeholder. May include some tools to crop, resize, etc. the image better for the card image. 
<br>
- Create "Script" - This is the most abmitious but very possible with the advent of "A.I." At the moment it is enough to make an api call to ChatGPT for example to create a simple script. However, I'm currently looking into training a model on custom scripts and run that off of a spare RTX card that should allow for more complex scripting.



