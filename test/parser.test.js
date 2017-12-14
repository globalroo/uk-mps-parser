import { allMembersResponse as mockAllMembersResponse } from "test/fake-data/all-members-response";

import {
	getData,
	getMemberData,
	outputMembers,
	PROCESSED_DATA_FILE
} from "src/parser";

const mockIndividualMPFormatted = {
	id: "test",
	addressLine1: "House of Commons",
	addressLine2: "London",
	constituencyGroupName: "Hackney North and Stoke Newington",
	constituencyGroupStartDate: "1983-06-09+00:00",
	email: "diane.abbott.office@parliament.uk",
	fullName: "Ms Diane Abbott",
	honorificName: "Rt Hon Diane Abbott MP",
	houseName: "House of Commons",
	partyName: "Labour",
	personFamilyName: "Abbott",
	personGivenName: "Diane",
	personHasPersonalWebLink: "http://www.dianeabbott.org.uk/",
	personHasTwitterWebLink: "https://twitter.com/HackneyAbbott",
	personOtherNames: "Julie",
	phoneNumber: "020 7219 4426",
	positionName: "Shadow Home Secretary",
	postCode: "SW1A 0AA"
};

const mockForceRequestErrorBadIndex = {
	"https://id.parliament.uk/throw_error": {
		"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
			{
				value: "https://id.parliament.uk/schema/Person",
				type: "uri"
			}
		],
		"http://example.com/F31CBD81AD8343898B49DC65743F0BDF": [
			{
				value: "Ms Diane Abbott",
				type: "literal"
			}
		]
	}
};
jest.mock("src/get-extended-mp-info", () => {
	const Promise = require("bluebird");
	return {
		getMPExtendedInfo: jest.fn((ix) => {
			if (ix.includes("throw_error")) {
				return Promise.reject({
					status: 404,
					statusText: "Test Error state"
				});
			} else {
				return Promise.resolve(mockIndividualMPFormatted);
			}
		})
	};
});

const mockWriteFileSync = jest.fn();

jest.mock("fs", () => {
	return {
		writeFileSync: (fieName, data) => mockWriteFileSync(fieName, data)
	};
});

jest.mock("axios", () => {
	const Promise = require("bluebird");
	return {
		get: jest.fn((url) => {
			if (url.includes("throw_error")) {
				return Promise.reject({
					response: {
						status: 500,
						statusText: "Test Error state"
					}
				});
			} else if (url.includes("house_current_members")) {
				return Promise.resolve({
					data: mockAllMembersResponse
				});
			} else if (url.includes("bad_data")) {
				return Promise.resolve({
					data: mockForceRequestErrorBadIndex
				});
			}
		})
	};
});

describe("Test Parser", () => {
	test("Get all members from the mock endpoint (unformatted)", async () => {
		const rawData = await getData("house_current_members");
		expect(rawData).toMatchSnapshot();
	});

	test("Get all members from the mock endpoint and process them", async () => {
		const rawData = await getData("house_current_members");
		const processedData = await getMemberData(rawData);
		expect(processedData.length).toBe(2);
	});

	test("Get member data with no data", async () => {
		const processedData = await getMemberData();
		expect(processedData.length).toBe(0);
	});

	test("Server error requesting all MPs", async () => {
		const test = await getData("throw_error");
		expect(test).toEqual({ status: 500, statusText: "Test Error state" });
	});

	test("Parser ignores bad requests to individual MP endpoint", async () => {
		const rawData = await getData("bad_data");
		const processedData = await getMemberData(rawData);
		expect(processedData).toEqual([]);
	});

	test("Parser outputs to file", async () => {
		const testData = { test: "test" };
		await outputMembers(testData);
		expect(mockWriteFileSync).toHaveBeenCalledWith(
			PROCESSED_DATA_FILE,
			JSON.stringify(testData)
		);
	});
});
