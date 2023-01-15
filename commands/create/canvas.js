const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { MessageAttachment, Collection } = require('discord.js');
const CardCache = require('./cache');
const { join } = require('path');
const { Attributes, Types } = require('./constants');

// assets
const Templates = new Collection([
	['Normal', 'assets/card-normal.png'],
	['Pendulum', 'assets/card-normal-pendulum.png'],
]);

const AttArt = new Collection([
	['DARK', 'assets/dark.png'],
]);

const registerFonts = bool => {
	const path = join(__dirname, '../../', 'assets/fonts', 'Yu-Gi-Oh! Matrix Book.ttf');
	GlobalFonts.registerFromPath(path, 'YugiBook');

	const logFonts = () => {
		const list = [];
		// eslint-disable-next-line no-unused-vars
		for (const [ _, fontObject] of GlobalFonts.families.entries()) {
			const { family } = fontObject;
			list.push(family);
		}

		return list;
	};

	if (bool) return logFonts();
	return 'No Logs On';
};

const newCanvas = params => {
	const size = {
		x: params?.x ?? 421,
		y: params?.y ?? 614,
	};

	registerFonts(false);
	// console.log(fontList);
	const canvas = createCanvas(size.x, size.y);
	const context = canvas.getContext('2d');

	return [canvas, context];
};

const addEffect = (context, cardData) => {
	const [data, card] = cardData;
	const { temp } = data?.step === 1 ? data : card;
	context.font = '15px YugiBook';
	context.fillStyle = '#000';
	context.fillText(`${temp.cardDesc}`, 30, 490);
};

const addPendulumEffect = (context, cardData) => {
	const [data, card] = cardData;
	const { temp } = data?.step === 1 ? data : card;
	context.font = '15px YugiBook';
	context.fillStyle = '#000';
	context.fillText(`${temp.cardPEff}`, 65, 400);
};

const addPasscode = (context, cardData) => {
	const [data, card] = cardData;
	const { id } = data?.step === 1 ? data : card;
	context.font = '13px Stone Serif';
	context.fillStyle = '#000';
	context.fillText(`${id}`, 16, 597);
};

const addAttribute = async (context, cardData) => {
	const [data, card] = cardData;
	const { step } = data;
	const { attribute: att } = step === 1 ? { attribute: 32 } : card.attribute;
	const attKey = Attributes.findKey(v => v === att);
	const attTemplate = AttArt.at(attKey);

	try {
		const attImg = await loadImage(attTemplate);
		context.drawImage(attImg, 353, 28, 39, 39);

		return context;
	}
	catch (err) {
		console.log('Canvas Attribute Error: ', err.message);
	}
};

const addATKDEF = (context, cardData) => {
	const [_,card] = cardData;
	const { atk, def } = card;

	context.font = 'small-caps 20px Matrix';
	context.fillStyle = '#000000';
	// def / atk
	context.fillText(`${atk}`, 348, 573);
	context.fillText(`${def}`, 263, 573);

	return context;
};

const addTypes = (context, cardData) => {
	const [data, card] = cardData;
	const { step } = data;

	const typeText = (() => {
		if (step === 1) return 'Zombie / Normal';

		// data returned in step 2
		// data { ..., type: [int, bool] }
		const type = step === 2 ? data?.type[0] : card?.type;
		const tStr = Types.reduce((acc, v, t) => {
			if ((type & v).toString(16) != 0) {
				return acc.concat(t + ' ');
			}
			return acc;
		}, '').replace(/\s\b/g, ' / ');

		return tStr;
	})();

	context.font = 'small-caps bold 13px ITC Stone Serif';
	context.fillStyle = '#000000';
	context.fillText(`[${typeText}]`, 31, 475);

	return context;
};

const addTemplate = async (canvas, context, cardData) => {
	const { width, height } = canvas;
	const [data, card] = cardData;
	const { step } = data;
	const { temp } = step === 1 ? data : card;
	const isPendy = temp?.cardPEff != 0 || temp?.isPendy;
	const cardBG = isPendy ? 'Pendulum' : 'Normal';

	try {
		const template = Templates.get(cardBG);
		const cardImage = await loadImage(template);

		context.drawImage(cardImage, 0, 0, width, height);
	}
	catch (err) {
		console.log('Canvas Template Error: ', err.message);
	}
};

const addName = (context, cardData) => {
	const [data, card] = cardData;
	const { name } = data?.step === 1 ? data : card;
	// Select the font size and type from one of the natively available fonts
	context.font = '45px MatrixRegularSmallCaps';

	// Select the style that will be used to fill the text in
	context.fillStyle = '#000';

	// Actually fill the text with a solid color
	context.fillText(`${name}`, 30, 60);
};

const createCard = async cacheObject => {
	const { cache, member, step } = cacheObject;
	const [canvas, context] = newCanvas();
	const data = CardCache.getStepCache({ cache, member, step });
	const card = CardCache.getCardCache(cache, member);
	const cardData = [data, card];

	await addTemplate(canvas, context, cardData);
	addPendulumEffect(context, cardData);
	addEffect(context, cardData);
	await addAttribute(context, cardData);
	addName(context, cardData);
	addPasscode(context, cardData);
	addTypes(context, cardData);
	addATKDEF(context, cardData);

	// todo
	// step 3 (atk, def, lvl, lscale, rscale)

	// todo
	// step 4 (link arrows)

	// todo
	// last step (finish)

	const canvasImage = await canvas.encode('png');
	const attach = new MessageAttachment(canvasImage, 'temp.png');

	return attach;
};

module.exports = {
	createCard,
};