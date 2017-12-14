import {
	getMeaningfulFields,
	requestMPExtendedInfo,
	getMPExtendedInfoURI,
	staggerRequestHoC,
	getMPExtendedInfo
} from "src/get-extended-mp-info";

import { endpointRawData as mockEndpointRawData } from "test/fake-data/extended-mp-info-response";

jest.mock("axios", () => {
	const Promise = require("bluebird");
	return {
		get: jest.fn((url) => {
			if (url.includes("throw_error")) {
				return Promise.reject({
					response: {
						status: 500,
						statusText: "Error"
					}
				});
			} else if (url.includes("person_by_id")) {
				return Promise.resolve({
					data: mockEndpointRawData
				});
			}
		})
	};
});

const individualMPFormatted = {
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

describe("Get Extended MP Info tests", () => {
	test("getMeaningfulFields", () => {
		const test = {};
		getMeaningfulFields("test", mockEndpointRawData, test);
		expect(test).toEqual(individualMPFormatted);
	});

	test("requestMPExtendedInfo", async () => {
		const test = await requestMPExtendedInfo("test");
		expect(test).toEqual(individualMPFormatted);
	});

	test("requestMPExtendedInfo with bad response", async () => {
		const test = await requestMPExtendedInfo("throw_error");
		expect(test).toEqual({ status: 500, statusText: "Error" });
	});

	test("Get Extended Info - call to the Single MP endpoint", () => {
		const testURI = getMPExtendedInfoURI("test");
		expect(testURI).toBe(
			"https://api.parliament.uk/Live/fixed-query/person_by_id?person_id=test&format=application%2Fjson"
		);
	});

	test("Get Extended Info - call to the Single MP endpoint with no data", () => {
		const testURI = getMPExtendedInfoURI();
		expect(testURI).toBe(
			"https://api.parliament.uk/Live/fixed-query/person_by_id?person_id=bad&format=application%2Fjson"
		);
	});

	test("staggerRequestHoC - create request handler for timeouts to stagger requests to server - execuste with good response", async () => {
		const resolve = jest.fn();
		const reject = jest.fn();
		const ix = "test";
		const staggerHoc = staggerRequestHoC(resolve, reject, ix);
		await staggerHoc();
		expect(resolve).toHaveBeenCalled();
	});

	test("staggerRequestHoC - create request handler for timeouts to stagger requests to server - execute with bad response", async () => {
		const resolve = jest.fn();
		const reject = jest.fn();
		const ix = "throw_error";
		const staggerHoc = staggerRequestHoC(resolve, reject, ix);
		await staggerHoc();
		expect(reject).toHaveBeenCalled();
	});

	test("getMPExtendedInfo", async () => {
		const test = await getMPExtendedInfo("test");
		expect(test).toEqual(individualMPFormatted);
	});
});
