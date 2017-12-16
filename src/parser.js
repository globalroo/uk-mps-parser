import axios from "axios";
import fs from "fs";

import {
	MEMBER_IMAGE_KEY,
	getRemoteThumbnailPortrait,
	getTailOfKey,
	getThumbnailPortrait,
	getValueFromKeyPair
} from "src/helpers";

import { getMPExtendedInfo } from "src/get-extended-mp-info";
import { getTwitterProfileImage } from "./helpers";

export const PROCESSED_DATA_FILE = "data/processed.json";

const FULLNAME_BY_FORENAME_KEY =
	"http://example.com/F31CBD81AD8343898B49DC65743F0BDF";
const PERSON_TYPE = "Person";
const RDF_DESCRIPTOR = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

const getIndividualMPData = async (index, mpName) => {
	try {
		//eslint-disable-next-line
		console.info(`${mpName} [${index}] being processed.`);
		return await getMPExtendedInfo(index);
	} catch (error) {
		const { status, statusText } = error;
		//eslint-disable-next-line
		console.error({ status, statusText });
	}
};

export const getMemberData = async (members = {}) => {
	const formattedMembers = [];
	for (const [recordIndex, recordData] of Object.entries(members)) {
		const recordType = getValueFromKeyPair(recordData[RDF_DESCRIPTOR]);
		if (recordType && recordType.includes(PERSON_TYPE)) {
			const index = getTailOfKey(recordIndex);
			const mpName = getValueFromKeyPair(recordData[FULLNAME_BY_FORENAME_KEY]);
			const extendedMPInfo = await getIndividualMPData(index, mpName);
			if (extendedMPInfo) {
				formattedMembers.push({
					id: index,
					...extendedMPInfo,
					localImage: getThumbnailPortrait(
						getTailOfKey(getValueFromKeyPair(recordData[MEMBER_IMAGE_KEY]))
					),
					remoteImage: getRemoteThumbnailPortrait(
						getTailOfKey(getValueFromKeyPair(recordData[MEMBER_IMAGE_KEY]))
					),
					twitterImage: getTwitterProfileImage(extendedMPInfo.personHasTwitterWebLink)
				});
			}
		}
	}
	return formattedMembers;
};

export const getData = async (url) => {
	try {
		const response = await axios.get(url);
		const { data } = response;
		return data;
	} catch (error) {
		const { response } = error;
		return response;
	}
};

export const outputMembers = async (processed) => {
	return await fs.writeFileSync(
		PROCESSED_DATA_FILE,
		JSON.stringify(await processed)
	);
};
