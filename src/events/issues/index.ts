import { IssuesEvent } from "@octokit/webhooks-types";
import actionGenerator from "../../lib/utils/actionGenerator";

import state from "./state";

export default actionGenerator<IssuesEvent>({
	opened: state,
	closed: state,
	reopened: state,
})
