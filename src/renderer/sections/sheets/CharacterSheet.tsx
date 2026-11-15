import { useState } from "react";
import { isDepleted, vitalStatus } from "../../../core/tracking";
import { useSheetsStore } from "./store";
import { PoolBar } from "./PoolBar";
import { EffectsPanel } from "./EffectsPanel";
import { PdfView } from "./PdfView";

const SPEND_PRESETS = [10, 15, 25, 30, 40];

export function CharacterSheet({
  slug,
  onBack,
}: {
  slug: string;
  onBack: () => void;
}) {
  const character = useSheetsStore((state) => state.characters[slug]);
  const dispatch = useSheetsStore((state) => state.dispatch);
  const canUndo = useSheetsStore((state) => state.canUndo(slug));
  const undo = useSheetsStore((state) => state.undo);
  const [view, setView] = useState<"live" | "pdf">("live");
  const [lastError, setLastError] = useState<string | null>(null);

  if (!character) {
    return <p className="p-6 text-parchment-dark">Loading…</p>;
  }

  const { sheet, profile, tracking } = character;

  if (!sheet || !profile || !tracking) {
    return (
      <div className="p-6">
        <button onClick={onBack} className="mb-4 text-gold hover:underline">
          ← Back
        </button>
        <p className="text-ember-bright">
          {slug} is missing or has an invalid sheet.yaml, profile.yaml or
          tracking.json. Check the console for the file/field that failed to
          validate.
        </p>
      </div>
    );
  }

  const report = (
    response: Awaited<ReturnType<typeof dispatch>>,
  ): void => {
    if (response && !response.ok) {
      setLastError(response.reason);
    } else {
      setLastError(null);
    }
  };

  const hpStatus = vitalStatus(tracking.hp, sheet.hp.max);
  const fpStatus = vitalStatus(tracking.fp, sheet.fp.max);
  const depleted = isDepleted(tracking);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className="text-gold hover:underline">
          ← Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setView("live")}
            className={`rounded border border-gold/40 px-3 py-1 text-sm ${view === "live" ? "bg-gold/20 text-gold-bright" : "text-gold"}`}
          >
            Live sheet
          </button>
          <button
            onClick={() => setView("pdf")}
            className={`rounded border border-gold/40 px-3 py-1 text-sm ${view === "pdf" ? "bg-gold/20 text-gold-bright" : "text-gold"}`}
          >
            PDF
          </button>
          <button
            onClick={() => void undo(slug)}
            disabled={!canUndo}
            className="rounded border border-gold/40 px-3 py-1 text-sm text-gold hover:bg-gold/10 disabled:opacity-30"
          >
            Undo
          </button>
        </div>
      </div>

      {lastError && (
        <p className="mb-4 rounded border border-ember/60 bg-night-deep px-3 py-2 text-sm text-ember-bright">
          {lastError}
        </p>
      )}

      {view === "pdf" ? (
        <PdfView path={`characters/${slug}/sheet.pdf`} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section>
            <h1 className="font-display text-2xl text-gold-bright">
              {profile.name}
            </h1>
            {profile.title && (
              <p className="font-reading text-parchment-dark">{profile.title}</p>
            )}
            {profile.player && (
              <p className="text-sm text-parchment-dark">Player: {profile.player}</p>
            )}

            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gold">Essos</span>
                  <span>{tracking.essos}/100</span>
                </div>
                <PoolBar value={tracking.essos} />
                <div className="mt-1 flex flex-wrap gap-1">
                  {SPEND_PRESETS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() =>
                        void dispatch(slug, { type: "spend", pool: "essos", amount }).then(report)
                      }
                      className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
                    >
                      -{amount}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      void dispatch(slug, { type: "gainEssos", amount: 25 }).then(report)
                    }
                    className="rounded border border-verdigris/50 px-2 py-0.5 text-xs text-verdigris hover:bg-verdigris/10"
                  >
                    +25
                  </button>
                  <button
                    onClick={() =>
                      void dispatch(slug, { type: "resetFromReserve" }).then(report)
                    }
                    className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
                  >
                    Reset from Reserve
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gold">Reserve</span>
                  <span>{tracking.reserve}/100</span>
                </div>
                <PoolBar value={tracking.reserve} depleted={depleted} />
                {depleted && (
                  <p className="mt-1 font-display uppercase tracking-wide text-blood">
                    Depleted — practically dead until treated
                  </p>
                )}
                <div className="mt-1 flex flex-wrap gap-1">
                  {SPEND_PRESETS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() =>
                        void dispatch(slug, { type: "spend", pool: "reserve", amount }).then(report)
                      }
                      className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
                    >
                      -{amount}
                    </button>
                  ))}
                  <button
                    onClick={() => void dispatch(slug, { type: "longRest" }).then(report)}
                    className="rounded border border-verdigris/50 px-2 py-0.5 text-xs text-verdigris hover:bg-verdigris/10"
                  >
                    Long rest
                  </button>
                  <button
                    onClick={() => {
                      const value = window.prompt("Set Reserve to (0-100):", String(tracking.reserve));
                      if (value === null) return;
                      void dispatch(slug, { type: "medicalTreatment", value: Number(value) }).then(report);
                    }}
                    className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
                  >
                    Medical treatment (GM)
                  </button>
                </div>
              </div>

              <div className="flex gap-6">
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gold">HP</span>
                    <button
                      onClick={() => void dispatch(slug, { type: "adjustHp", delta: -1 }).then(report)}
                      className="rounded border border-gold/30 px-2 text-xs text-gold"
                    >
                      −
                    </button>
                    <span className={hpStatus.critical ? "text-blood" : hpStatus.bloodied ? "text-ember-bright" : ""}>
                      {tracking.hp}/{sheet.hp.max}
                    </span>
                    <button
                      onClick={() => void dispatch(slug, { type: "adjustHp", delta: 1 }).then(report)}
                      className="rounded border border-gold/30 px-2 text-xs text-gold"
                    >
                      +
                    </button>
                  </div>
                  {hpStatus.bloodied && <p className="text-xs text-ember-bright">Bloodied</p>}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gold">FP</span>
                    <button
                      onClick={() => void dispatch(slug, { type: "adjustFp", delta: -1 }).then(report)}
                      className="rounded border border-gold/30 px-2 text-xs text-gold"
                    >
                      −
                    </button>
                    <span className={fpStatus.critical ? "text-blood" : fpStatus.bloodied ? "text-ember-bright" : ""}>
                      {tracking.fp}/{sheet.fp.max}
                    </span>
                    <button
                      onClick={() => void dispatch(slug, { type: "adjustFp", delta: 1 }).then(report)}
                      className="rounded border border-gold/30 px-2 text-xs text-gold"
                    >
                      +
                    </button>
                  </div>
                  {fpStatus.bloodied && <p className="text-xs text-ember-bright">Bloodied</p>}
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gold">Exceed</span>
                  <button
                    onClick={() => void dispatch(slug, { type: "newEncounter" }).then(report)}
                    className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
                  >
                    New encounter
                  </button>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => void dispatch(slug, { type: "burnExceed" }).then(report)}
                      disabled={tracking.exceed.used > i}
                      title={tracking.exceed.used > i ? "Broken" : "Burn"}
                      className={`h-6 w-6 rounded-full border-2 ${tracking.exceed.used > i ? "border-parchment-dark/40 bg-night-deep" : "border-gold bg-gold/30"}`}
                    />
                  ))}
                </div>
              </div>

              <MetaCurrencies slug={slug} />

              <EffectsPanel
                effects={tracking.effects}
                onAdd={(effect) => void dispatch(slug, { type: "addEffect", effect }).then(report)}
                onRemove={(name) => void dispatch(slug, { type: "removeEffect", name }).then(report)}
              />
            </div>
          </section>

          <section className="font-reading text-sm text-parchment">
            <h2 className="mb-2 font-display text-xl text-gold-bright">
              Sheet (read-only)
            </h2>
            <p>
              ST {sheet.attributes.st} · DX {sheet.attributes.dx} · IQ{" "}
              {sheet.attributes.iq} · HT {sheet.attributes.ht}
            </p>
            <p>
              Will {sheet.secondaryCharacteristics.will} · Per{" "}
              {sheet.secondaryCharacteristics.perception} · Speed{" "}
              {sheet.secondaryCharacteristics.basicSpeed} · Move{" "}
              {sheet.secondaryCharacteristics.basicMove} · Dodge{" "}
              {sheet.secondaryCharacteristics.dodge}
            </p>

            <h3 className="mt-3 font-display text-gold">Traits</h3>
            <ul>
              {sheet.traits.map((trait) => (
                <li key={trait.name}>
                  {trait.name}
                  {trait.points !== undefined && ` [${trait.points}]`}
                </li>
              ))}
            </ul>

            <h3 className="mt-3 font-display text-gold">Skills</h3>
            <ul>
              {sheet.skills.map((skill) => (
                <li key={skill.name}>
                  {skill.name} — {skill.level}
                </li>
              ))}
            </ul>

            <h3 className="mt-3 font-display text-gold">Weapons</h3>
            <ul>
              {sheet.weapons.map((weapon) => (
                <li key={weapon.name}>
                  {weapon.name} — {weapon.damage}
                </li>
              ))}
            </ul>

            <h3 className="mt-3 font-display text-gold">Equipment</h3>
            <ul>
              {sheet.equipment.map((item) => (
                <li key={item.name}>
                  {item.name} ×{item.quantity}
                </li>
              ))}
            </ul>

            <p className="mt-3">Points: {sheet.pointTotals.total}</p>
          </section>
        </div>
      )}
    </div>
  );
}

function MetaCurrencies({ slug }: { slug: string }) {
  const tracking = useSheetsStore((state) => state.characters[slug]?.tracking);
  const dispatch = useSheetsStore((state) => state.dispatch);
  const [inCombat, setInCombat] = useState(false);

  if (!tracking) return null;
  const { metaCurrencies } = tracking;

  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-sm">
        <span className="text-gold">Meta-currencies</span>
        <label className="ml-auto flex items-center gap-1 text-xs text-parchment-dark">
          <input
            type="checkbox"
            checked={inCombat}
            onChange={(event) => setInCombat(event.target.checked)}
          />
          In combat
        </label>
      </div>
      <ul className="space-y-1 text-sm">
        <li className="flex items-center justify-between">
          <span>Plot Points: {metaCurrencies.plotPoints}</span>
          <button
            onClick={() => void dispatch(slug, { type: "spendPlotPoint" })}
            className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
          >
            Spend (1/combat)
          </button>
        </li>
        <li className="flex items-center justify-between">
          <span>Flashback Points: {metaCurrencies.flashbackPoints}</span>
          <button
            onClick={() => void dispatch(slug, { type: "spendFlashbackPoint", inCombat })}
            className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
          >
            Spend ({inCombat ? 2 : 1})
          </button>
        </li>
        <li className="flex items-center justify-between">
          <span>Dharma: {metaCurrencies.dharma}</span>
          <button
            onClick={() => void dispatch(slug, { type: "spendDharma", amount: 1 })}
            className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
          >
            Spend 1
          </button>
        </li>
        <li>
          Karma: {metaCurrencies.karma}
          {metaCurrencies.karma >= 98 && (
            <span className="ml-2 text-ember-bright">approaching 108</span>
          )}
        </li>
        <li className="flex items-center justify-between">
          <span>Wildcard Points: {metaCurrencies.wildcardPoints}</span>
          <button
            onClick={() => void dispatch(slug, { type: "spendWildcardPoint", amount: 1 })}
            className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
          >
            Spend 1
          </button>
        </li>
      </ul>
    </div>
  );
}
