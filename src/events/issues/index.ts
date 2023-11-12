import { IssuesEvent } from "@octokit/webhooks-types";
import actionEmbedGenerator from "../../lib/utils/actionEmbedGenerator";

import opened from "./opened";
import closed from "./closed";

export default actionEmbedGenerator<IssuesEvent>({
	opened,
	closed,
})
