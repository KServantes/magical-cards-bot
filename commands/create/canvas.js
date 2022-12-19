const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { MessageAttachment } = require('discord.js');
const fs = require('node:fs/promises');


const newCanvas = params => {
	const size = {
		x: params?.x ?? 421,
		y: params?.y ?? 614,
	};

	const canvas = createCanvas(size.x, size.y);
	const context = canvas.getContext('2d');

	return [canvas, context];
};

const createCard = async () => {
	const [canvas, context] = newCanvas();

	await getTemplate(canvas, context);
	await getAttribute(context);
	await getATKDEF(context);
	await getTypes(context);

	const canvasImage = await canvas.encode('png');
	const attach = new MessageAttachment(canvasImage, 'temp.png');

	return attach;
};

const getAttribute = async (context) => {
	const attImg = await loadImage('assets/dark.png');
	context.drawImage(attImg, 353, 28, 39, 39);

	return context;
};

const getATKDEF = async (context) => {
	context.font = 'small-caps 20px Matrix';
	context.fillStyle = '#000000';
	// def / atk
	context.fillText('2200', 348, 573);
	context.fillText('2100', 263, 573);

	return context;
};

const getTypes = async (context) => {
	context.font = 'small-caps bold 15px ITC Stone Serif';
	context.fillStyle = '#000000';
	context.fillText('EFFECT', 30, 478);

	return context;
};

const getTemplate = async (canvas, context) => {
	const { width, height } = canvas;
	try {
		const cardImage = await loadImage('assets/card-normal-pendulum.png');

		context.drawImage(cardImage, 0, 0, width, height);

		// Select the font size and type from one of the natively available fonts
		context.font = '45px MatrixRegularSmallCaps';

		// Select the style that will be used to fill the text in
		context.fillStyle = '#ffffff';

		// Actually fill the text with a solid color
		context.fillText('Card Name', 30, 60);
	}
	catch (err) {
		console.log('There was an error: ', err.message);
	}
};

module.exports = {
	getTemplate,
	createCard,
};