import { IssuesEvent } from "@octokit/webhooks-types";
import actionEmbedGenerator from "../../lib/utils/actionEmbedGenerator";

import state from "./state";

export default actionEmbedGenerator<IssuesEvent>({
	opened: state,
	closed: state,
	reopened: state,
})
