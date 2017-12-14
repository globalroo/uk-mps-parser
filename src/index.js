import {
	ALL_PARLIAMENT_MEMBERS
} from "src/helpers";

import {
	getData, getMemberData, outputMembers
} from "src/parser";

const go = async () => {
	const data = await getData(ALL_PARLIAMENT_MEMBERS);
	const processedData = getMemberData(data);
	await outputMembers(processedData);
};

go();
