import {
	ALL_PARLIAMENT_MEMBERS,
	getThumbnailPortrait,
	getValueFromKeyPair,
	getRemoteThumbnailPortrait,
	getUsefulField,
	getTailOfKey,
	getTwitterProfileImage
} from "src/helpers";

describe("Helper tests", () => {
	test("Check URL is as expected", () => {
		expect(ALL_PARLIAMENT_MEMBERS).toBe(
			"https://api.parliament.uk/Live/fixed-query/house_current_members?house_id=1AFu55Hs&format=application%2Fjson"
		);
	});

	test("Check Local Thumbnail paths are returned as expected", () => {
		const localPath = getThumbnailPortrait("test");
		expect(localPath).toBe("images/test.jpeg");
	});

	test("Check Local Thumbnail paths are returned as with no id", () => {
		const localPath = getThumbnailPortrait();
		expect(localPath).toBe("images/404.jpeg");
	});

	test("Check Remote Thumbnail paths are returned as expected when a legitimate id is passed in", () => {
		const localPath = getRemoteThumbnailPortrait("test");
		expect(localPath).toBe(
			"https://api.parliament.uk/Live/photo/test.jpeg?crop=CU_1:1&width=186&quality=80"
		);
	});

	test("Check Remote Thumbnail paths are returned as 404 when no id is passed in", () => {
		const localPath = getRemoteThumbnailPortrait();
		expect(localPath).toBe(
			"https://api.parliament.uk/Live/photo/404.jpeg?crop=CU_1:1&width=186&quality=80"
		);
	});

	test("If a field exists in the meaningful field lookup, return the desired label", () => {
		const testField = getUsefulField("postCode");
		expect(testField).toBe("postCode");
	});

	test("If a field doesn't exists in the meaningful field lookup, return undefined", () => {
		const testField = getUsefulField();
		expect(testField).toBeUndfined;
	});

	test("Get the tail of a key value", () => {
		const test = getTailOfKey("http://example.com/tail");
		expect(test).toBe("tail");
	});

	test("Get the tail of a key value when no value sent through", () => {
		const test = getTailOfKey();
		expect(test).toBe("");
	});

	test("Get Value from Key Pair", () => {
		const mockData = [
			{
				value: "Ms Diane Abbott",
				type: "literal"
			}
		];
		const result = getValueFromKeyPair(mockData);
		expect(result).toBe("Ms Diane Abbott");
	});

	test("Get Value from Key Pair when bad data passed through i.e. undefined", () => {
		const result = getValueFromKeyPair();
		expect(result).toBe(undefined);
	});

	test("Get Twitter avatar image if available", () => {
		const result = getTwitterProfileImage("globalroo");
		expect(result).toBe("https://res.cloudinary.com/globalroo/image/twitter_name/w_300/globalroo.jpeg");
	});

	test("Get Twitter avatar image returns undefined if not available", () => {
		const result = getTwitterProfileImage();
		expect(result).toBe(undefined);
	});

});
