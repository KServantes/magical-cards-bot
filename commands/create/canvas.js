const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { MessageAttachment, Collection } = require('discord.js');
const CardCache = require('./cache');
const { join } = require('path');

// assets
const templates = new Collection([
	['Normal', 'assets/card-normal.png'],
	['Pendulum', 'assets/card-normal-pendulum.png'],
]);

const registerFonts = () => {
	const path = join(__dirname, '../../', 'assets/fonts', 'Yu-Gi-Oh! Matrix Book.ttf');
	GlobalFonts.registerFromPath(path, 'YugiBook');

	const list = [];
	// eslint-disable-next-line no-unused-vars
	for (const [ _, fontObject] of GlobalFonts.families.entries()) {
		const { family } = fontObject;
		list.push(family);
	}

	return list;
};

const newCanvas = params => {
	const size = {
		x: params?.x ?? 421,
		y: params?.y ?? 614,
	};

	const fontList = registerFonts();
	// console.log(fontList);
	const canvas = createCanvas(size.x, size.y);
	const context = canvas.getContext('2d');

	return [canvas, context];
};

const getEffect = (context, cardData) => {
	const { temp } = cardData;
	context.font = '15px YugiBook';
	context.fillStyle = '#000';
	context.fillText(`${temp.cardDesc}`, 30, 490);
	// todo text wrap
	// console.log(context.measureText(`${temp.cardDesc}`));
};

const getPendulumEffect = (context, cardData) => {
	const { temp } = cardData;
	context.font = '15px YugiBook';
	context.fillStyle = '#000';
	context.fillText(`${temp.cardPEff}`, 65, 400);
};

const addPasscode = (context, cardData) => {
	const { id } = cardData;
	context.font = '13px Stone Serif';
	context.fillStyle = '#000';
	context.fillText(`${id}`, 16, 597);
};

const getAttribute = async (context) => {
	const attImg = await loadImage('assets/dark.png');
	context.drawImage(attImg, 353, 28, 39, 39);

	return context;
};

const getATKDEF = (context) => {
	context.font = 'small-caps 20px Matrix';
	context.fillStyle = '#000000';
	// def / atk
	context.fillText('2200', 348, 573);
	context.fillText('2100', 263, 573);

	return context;
};

const getTypes = (context) => {
	context.font = 'small-caps bold 13px ITC Stone Serif';
	context.fillStyle = '#000000';
	context.fillText('[NORMAL / PENDULUM]', 31, 475);

	return context;
};

const getTemplate = async (canvas, context, cardData) => {
	const { width, height } = canvas;
	const { step } = cardData;
	let cardBG;
	if (step === 1) {
		const { temp } = cardData;
		if (temp.cardPEff.length === 0) cardBG = 'Normal';
		else cardBG = 'Pendulum';
	}

	try {
		const template = templates.get(cardBG);
		const cardImage = await loadImage(template);

		context.drawImage(cardImage, 0, 0, width, height);
		return cardBG;
	}
	catch (err) {
		console.log('There was an error: ', err.message);
	}
};

const getName = (context, cardData) => {
	const { name } = cardData;
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
	const data = CardCache.getStepCache({ cache, member, step: 1 });

	if (step === 1) {
		const template = await getTemplate(canvas, context, data);
		if (template === 'Pendulum') getPendulumEffect(context, data);
		// todo effects on other cards
		getEffect(context, data);
		getName(context, data);
		addPasscode(context, data);
		getTypes(context);
	}

	const canvasImage = await canvas.encode('png');
	const attach = new MessageAttachment(canvasImage, 'temp.png');

	return attach;
};

module.exports = {
	createCard,
};