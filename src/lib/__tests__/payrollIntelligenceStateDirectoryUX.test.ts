import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {stateDirectoryEntries,stateDirectoryTopics,validateStateDirectory} from "../payroll-intelligence-state-directory";

describe("PSE marketing state directory usability and boundary",()=>{
 it("preserves all 51 unique source-linked jurisdictions in alphabetical order",()=>{
  expect(validateStateDirectory()).toEqual([]);
  expect(stateDirectoryEntries).toHaveLength(51);
  expect(new Set(stateDirectoryEntries.map(x=>x.state)).size).toBe(51);
  expect(stateDirectoryEntries.some(x=>x.state==="DC"&&x.stateName==="District of Columbia")).toBe(true);
  expect(stateDirectoryEntries.map(x=>x.stateName)).toEqual([...stateDirectoryEntries.map(x=>x.stateName)].sort((a,b)=>a.localeCompare(b,"en")));
  expect(stateDirectoryTopics.length).toBeGreaterThan(5);
 });
 it("uses labeled keyboard-accessible search, topic filters, status and empty-state reset",()=>{
  const client=readFileSync("src/components/payroll-intelligence/StateSourceExplorer.tsx","utf8");
  const page=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  expect(client).toContain('"use client"');
  expect(client).toContain('htmlFor="state-directory-search"');
  expect(client).toContain('id="state-directory-search"');
  expect(client).toContain('htmlFor="state-directory-topic"');
  expect(client).toContain('id="state-directory-topic"');
  expect(client).toContain('role="status"');
  expect(client).toContain('aria-live="polite"');
  expect(client).toContain('Clear search and filters');
  expect(client).toContain('e.stateName');
  expect(client).toContain('rel="noopener noreferrer"');
  expect(page).toContain('StateSourceExplorer');
  expect(page).toContain('index:false');
 });
 it("does not publish operational PSE rules and retains precise scope caveats",()=>{
  const page=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  const detail=readFileSync("src/app/payroll-intelligence/state-sources/[state]/page.tsx","utf8");
  expect(page).toContain("not complete state compliance profiles");
  expect(page).toContain("Rule-specific legal verification");
  expect(detail).toContain("index:false");
  expect(detail).toContain("b.caution");
  expect(detail).toContain("b.sourceUrl");
  expect(stateDirectoryEntries.every(e=>e.sourceUrl.startsWith("https://")&&e.caution.length>25)).toBe(true);
 });
});
