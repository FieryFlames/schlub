export const GITHUB_URL = 'https://github.com';

const REFS_REGEX = /refs\/(heads|tags)\//

export type RefType = "heads" | "tags";

export function getBranchOrTag(ref: string) {
	return ref.replace(REFS_REGEX, '')
}

export function getRefType(ref: string) {
	return ref.match(REFS_REGEX)?.[1]! as RefType
}
