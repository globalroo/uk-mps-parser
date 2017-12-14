import axios from "axios";
import Promise from "bluebird";

import { getTailOfKey, getUsefulField, getValueFromKeyPair } from "src/helpers";

const SERVER_REQUEST_DELAY = 100;

export const getMPExtendedInfoURI = (ix = "bad") =>
	`https://api.parliament.uk/Live/fixed-query/person_by_id?person_id=${ix}&format=application%2Fjson`;

export const getMeaningfulFields = (ix, data, useful) => {
	for (const [recordIndex, recordData] of Object.entries(data)) {
		const fieldName = getUsefulField(getTailOfKey(recordIndex));
		if (fieldName) {
			useful[fieldName] = getValueFromKeyPair(recordData);
		} else {
			if (typeof recordData === "object") {
				getMeaningfulFields(ix, recordData, useful);
			}
		}
	}
};

export const requestMPExtendedInfo = async (ix) => {
	try {
		const mpData = {};
		const response = await axios.get(getMPExtendedInfoURI(ix));
		const { data } = response;
		getMeaningfulFields(ix, data, mpData);
		return mpData;
	} catch (error) {
		const { response } = error;
		return response;
	}
};

export const staggerRequestHoC = (resolve, reject, ix) => async () => {
	const mpInfo = await requestMPExtendedInfo(ix);
	mpInfo.status ? reject(mpInfo) : resolve(mpInfo);
};

export const getMPExtendedInfo = (ix) => {
	return new Promise((resolve, reject) => {
		setTimeout(staggerRequestHoC(resolve, reject, ix), SERVER_REQUEST_DELAY);
	});
};
