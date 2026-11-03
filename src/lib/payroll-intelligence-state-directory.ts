/** Marketing-only state-directory projection. All sources remain educational,
 * independently unratified, and not an operational PSE Context Hub rule.
 */
import { stateSourceIntake } from "./payroll-intelligence-state-research";
import { stateBriefings } from "./payroll-intelligence-state-briefings";
import { additionalStateBriefings } from "./payroll-intelligence-state-expansion";
import { furtherStateBriefings } from "./payroll-intelligence-state-batch03";
import { stateBatch04Briefings } from "./payroll-intelligence-state-batch04";
import { stateBatch05Briefings } from "./payroll-intelligence-state-batch05";
import { stateBatch06Briefings } from "./payroll-intelligence-state-batch06";
import { stateBatch07Briefings } from "./payroll-intelligence-state-batch07";
import { stateBatch08Briefings } from "./payroll-intelligence-state-batch08";

export const allStateBriefings = [
 ...stateBriefings, ...additionalStateBriefings, ...furtherStateBriefings,
 ...stateBatch04Briefings, ...stateBatch05Briefings, ...stateBatch06Briefings,
 ...stateBatch07Briefings, ...stateBatch08Briefings,
] as const;

const intakeNames: ReadonlyMap<string,string> = new Map(
 stateSourceIntake.map(s=>[s.state,s.stateName]),
);

export type DirectoryEntry = {
 state: string;
 stateName: string;
 topic: string;
 caution: string;
 sourceTitle: string;
 sourceUrl: string;
 pinpoint: string;
 checkedOn: string;
};

export const stateDirectoryEntries: readonly DirectoryEntry[] = allStateBriefings.map(b=>({
 state:b.state,
 stateName:intakeNames.get(b.state) ?? ("stateName" in b ? b.stateName : b.state),
 topic:b.topic,
 caution:b.caution,
 sourceTitle:b.sourceTitle,
 sourceUrl:b.sourceUrl,
 pinpoint:b.pinpoint,
 checkedOn:b.checkedOn,
})).sort((a,b)=>a.stateName.localeCompare(b.stateName,"en"));

export const stateDirectoryTopics = [...new Set(stateDirectoryEntries.map(e=>e.topic))].sort((a,b)=>a.localeCompare(b));

export function validateStateDirectory():string[]{
 const errors:string[]=[];
 if(stateDirectoryEntries.length!==51)errors.push("Expected exactly 51 jurisdictions");
 if(new Set(stateDirectoryEntries.map(e=>e.state)).size!==51)errors.push("Duplicate jurisdiction");
 for(const e of stateDirectoryEntries){
  if(e.stateName===e.state)errors.push("Missing jurisdiction name "+e.state);
  if(!e.sourceUrl.startsWith("https://"))errors.push("Invalid official link "+e.state);
  if(!e.caution.trim()||!e.pinpoint.trim())errors.push("Missing scope/source "+e.state);
 }
 return errors;
}
