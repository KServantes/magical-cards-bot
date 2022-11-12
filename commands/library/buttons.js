const Cache = require('./cache');
const Helper = require('./msgHelper');


const bcDetails = async interaction => {
	const { member, client, customId } = interaction;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.selectOn = parseInt(customId.at(-1));

	const { embeds, components, error } = await Helper.showDetails(interaction);

	if (error) return await Helper.defaultError(interaction);
	return await interaction.update({ embeds, components });
};

const bcNextPage = async interaction => {
	const { member, client } = interaction;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.newPage = 1;
	memInfo.selectOn = 10;

	return await Helper.updateEmbedMsg(interaction);
};

const bcPrevPage = async interaction => {
	const { member, client } = interaction;
	const { cache } = client;

	const memInfo = Cache.getMemberInfo(cache, member);
	memInfo.newPage = -1;
	memInfo.selectOn = 10;

	return await Helper.updateEmbedMsg(interaction);
};

module.exports = {
	bcNextPage,
	bcPrevPage,
	bcDetails,
};