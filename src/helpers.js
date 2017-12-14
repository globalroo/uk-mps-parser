export const MEMBER_IMAGE_KEY =
	"https://id.parliament.uk/schema/memberHasMemberImage";

const meaningfulFields = {
	D79B0BAC513C4A9A87C9D5AFF1FC632F: "honorificName",
	F31CBD81AD8343898B49DC65743F0BDF: "fullName",
	addressLine1: "addressLine1",
	addressLine2: "addressLine2",
	constituencyGroupName: "constituencyGroupName",
	constituencyGroupStartDate: "constituencyGroupStartDate",
	email: "email",
	houseName: "houseName",
	partyName: "partyName",
	personFamilyName: "personFamilyName",
	personGivenName: "personGivenName",
	personHasPersonalWebLink: "personHasPersonalWebLink",
	personHasTwitterWebLink: "personHasTwitterWebLink",
	personOtherNames: "personOtherNames",
	phoneNumber: "phoneNumber",
	positionName: "positionName",
	postCode: "postCode"
};

export const ALL_PARLIAMENT_MEMBERS =
	"https://api.parliament.uk/Live/fixed-query/house_current_members?house_id=1AFu55Hs&format=application%2Fjson";

export const getThumbnailPortrait = (id = "404") => `images/${id}.jpeg`;

export const getRemoteThumbnailPortrait = (id = "404") =>
	`https://api.parliament.uk/Live/photo/${id}.jpeg?crop=CU_1:1&width=186&quality=80`;

export const getUsefulField = (key = "") => meaningfulFields[key];

export const getTailOfKey = (key = "") => key.split("/").pop();

export const getValueFromKeyPair = (keypairArr = []) => {
	const [keypair = { value: undefined }] = keypairArr;
	const { value } = keypair;
	return value;
};
