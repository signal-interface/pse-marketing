"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { DirectoryEntry } from "@/lib/payroll-intelligence-state-directory";

type Props={entries:readonly DirectoryEntry[]; topics:readonly string[]};
export default function StateSourceExplorer({entries,topics}:Props){
 const [search,setSearch]=useState("");
 const [topic,setTopic]=useState("all");
 const filtered=useMemo(()=>entries.filter(e=>{
  const query=search.trim().toLocaleLowerCase();
  const matches=!query||[e.stateName,e.state,e.topic,e.pinpoint].some(s=>s.toLocaleLowerCase().includes(query));
  return matches&&(topic==="all"||e.topic===topic);
 }),[entries,search,topic]);
 return <section aria-labelledby="state-explorer-heading">
  <h2 id="state-explorer-heading" className="text-2xl font-bold text-navy mb-5">Browse jurisdictions</h2>
  <div className="grid md:grid-cols-2 gap-5 bg-white border border-border rounded-xl p-5 mb-6">
   <div>
    <label htmlFor="state-directory-search" className="block text-sm font-semibold mb-2 text-navy">Search state or payroll topic</label>
    <input id="state-directory-search" type="search" autoComplete="off" value={search} onChange={event=>setSearch(event.target.value)} placeholder="e.g. California, DC, final wages" className="w-full border border-border rounded-lg p-3 text-navy bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-accent"/>
   </div>
   <div>
    <label htmlFor="state-directory-topic" className="block text-sm font-semibold mb-2 text-navy">Filter by introductory topic</label>
    <select id="state-directory-topic" value={topic} onChange={event=>setTopic(event.target.value)} className="w-full border border-border rounded-lg p-3 text-navy bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-accent">
     <option value="all">All topics</option>
     {topics.map(t=><option value={t} key={t}>{t}</option>)}
    </select>
   </div>
  </div>
  <p role="status" aria-live="polite" className="text-sm text-text-secondary mb-6">{filtered.length} of {entries.length} jurisdictions displayed</p>
  {filtered.length===0?<div className="bg-white rounded-xl border border-border p-8">
    <h3 className="text-lg font-semibold text-navy">No matching jurisdictions</h3>
    <p className="text-text-secondary mt-2 mb-4">Try a state name, postal abbreviation or another topic.</p>
    <button type="button" onClick={()=>{setSearch("");setTopic("all");}} className="text-blue-accent underline focus-visible:outline focus-visible:outline-2">Clear search and filters</button>
   </div>:
   <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{filtered.map(e=><article key={e.state} className="bg-white border border-border rounded-xl p-6 flex flex-col">
    <p className="font-mono text-sm text-steel mb-2">{e.state}</p>
    <h3 className="text-xl font-semibold text-navy mb-3">{e.stateName}</h3>
    <p className="text-sm font-semibold mb-3">{e.topic}</p>
    <p className="text-sm text-text-secondary mb-4">Review caveat: {e.caution}</p>
    <p className="text-sm text-text-secondary mb-4">Source pinpoint: {e.pinpoint}</p>
    <div className="mt-auto pt-3 space-y-3">
     <Link href={`/payroll-intelligence/state-sources/${e.state.toLowerCase()}`} className="block text-blue-accent underline text-sm font-semibold focus-visible:outline focus-visible:outline-2">Read {e.stateName} educational briefing</Link>
     <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-accent underline text-sm focus-visible:outline focus-visible:outline-2">Official source: {e.sourceTitle} (opens new tab)</a>
    </div>
   </article>)}</div>}
 </section>;
}
