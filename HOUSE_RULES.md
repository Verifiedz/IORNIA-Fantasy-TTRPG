# GURPS Combat + House Rules

Source: "Combat Steps / House Rules" PDF (41 pages), transcribed 14 November 2026.

**How to read this file**

- This is a transcription, in the source's order, with spelling and layout
  tidied. Rules have not been changed, completed or reinterpreted.
- `> [OPEN]` marks a place where the source is incomplete, cut off or
  contradicts itself. Do not invent the missing rule; ask the GM.
- `> [NOTE]` marks a transcription note or a ruling the GM has since given.
- Status words from the source are kept: **Under rework**, **Deprecated**.
- This file contains house rules only. It is not a substitute for the GURPS
  rulebooks and contains no rulebook text. Page references such as "B135"
  point to the GURPS Basic Set.

---

## 1. Initiative and surprise

1. If an individual is surprised, they are stunned for 1 turn and must roll
   against HT to regain their composure.
2. If Speeds are tied (within +2/-2 of each other), each individual rolls
   initiative: Speed + 3d6. Highest value sets turn order.
3. If the Speed difference is greater than 2, the highest Speed automatically
   goes first.

## 2. Maneuvers

1. Pick a maneuver. Usually only one; more if you burn an "Exceed" or take a
   bonus action.
2. A maneuver usually includes one of: no movement, 1 hex, half movement, or
   full movement.

### 2.1 Maneuver list (what you can do on your turn)

Maneuver types: **Preparation**, **Attack**, **Move**, **Defend**, **Mental**.
A maneuver may have a **[Special]** option and/or an **[Extra Effort]** option
added to it. Extra Effort options cost FP.

In the source the types are colour-coded: Preparation green, Attack red,
Move blue, Defend yellow, Mental purple; Special options in red text, Extra
Effort options in blue text.

| Maneuver | Type | Effect | Move | Defense |
|---|---|---|---|---|
| Ready | Preparation | Ready or reload a weapon (may require multiple rounds), retrieve a belt item, drink a potion, etc. | Step | Any |
| Aim (Ranged) | Preparation | Add the weapon's Acc to your skill for your next Attack. +1 for each Aim maneuver after the first (max Acc+2). Using any Active Defense cancels the Aim bonus. Will roll if injured to maintain the Aim bonus. | Step | Any* |
| Feint (Melee) | Preparation | Quick contest of your weapon/cloak skill vs the target's weapon/cloak/shield skill or DX. Apply the win margin to your next attack (either adding to your skill or subtracting from their defense). | Step | Any |
| Regular Attack | Attack | Melee or Ranged. May step (1 yard/hex) before or after the attack. | Step | Any |
| All-Out Attack (choose one) | Attack | **Determined** (Melee/Ranged): 1 attack, +4 to hit (Melee) / +1 to hit (Ranged). **Strong** (Melee): 1 attack, +2 damage or +1 per die, whichever is larger. **Double** (Melee): 2 attacks (each attack must be different). **Feint** (Melee): make a Feint and then 1 Regular Attack. | 1/2 Move (round up) | None |
| Charge Attack | Attack | Charge up to your full Move, then Attack. -4 to hit (max effective skill 9). Cannot Retreat. | Move | Dodge/Block |
| Change Posture | Move | Prone -> Crouch/Kneel -> Standing. May go from Kneel -> Standing as the "Step" of another maneuver. | None | Any |
| Jump | Move | Distance in yards/hexes is Move/2 or Jumping/4 (x2 with a running start, x1/2 if in combat). | Varies | Any |
| Move | Move | Movement points equal Basic Move. Move (and face) into forward hex: 1 pt. Turn 1 hex face: 1 pt. Obstruction (ally, rock, log, etc.): +1 pt. Side/back step (no face change): 2 pts. If you used less than half your points you may end with any facing; otherwise you are allowed 1 final hex-face change. | Move | Any |
| All-Out Defense (choose one) | Defend | **Increased**: +2 to any one Active Defense until your next turn. **Double**: can use two different defenses against an attack, until your next turn. | Step | Any |
| Concentrate | Mental | Will-3 roll to maintain concentration if injured or if you used an Active Defense. | Step | Any* |
| Do Nothing | Mental | If you are doing nothing because you are **Stunned**, -4 to your Active Defense. | None | Any |

> [OPEN] The Concentrate row reads "WILL-3 2 roll" in the source. Transcribed
> as Will-3; the stray "2" is unexplained.

> [NOTE] The Defense cell of the Move row in the source is filled with a
> column of numbers (11 down to 1, then 1 up to 10). It looks like a layout
> artifact and is omitted.

**Special options**

| Option | Attaches to | Effect |
|---|---|---|
| [Deceptive Attack] or [Lead the Target] | Attack (Melee or Ranged) | For each -2 to your Attack skill (you cannot reduce your skill below 10), the target gets -1 to their Defense. Cannot be used with Charge Attack. |
| [Telegraphic Attack] | Attack | +4 to hit; the target gets +2 to Defense. Cannot be used with Ranged or Charge Attack or Feint. Does not affect crit chance. |
| [Wait] | Do Nothing | Define a "trigger"; if it occurs, perform a maneuver ("If the monster moves within range, Attack!"). |

**Extra Effort options (cost FP)**

| Option | Attaches to | Effect |
|---|---|---|
| [Rapid Recovery] | Ready | Pay 1 FP to ready an unready melee weapon instantly (cannot be used to ready ammo). |
| [Mighty Blow] | Regular Attack (Melee) only | Pay 1 FP to get +2 damage, or +1 per die, whichever is larger. |
| [Heroic Charge] | Charge Attack | Pay 1 FP to ignore Charge Attack penalties (-4 to hit and max effective skill 9). |
| [Giant Step] | Move / Attack | Pay 1 FP to take an additional step, either before or after the attack. |

### 2.2 Active defenses (what you can do if you get attacked *and you know about it*)

Attacked from a side or back hex: -2 (0 with Peripheral Vision). Attacked from
the back hex (if the attacker started there): -4 Dodge (-2 with Peripheral
Vision or a Blind Fighting roll).

| Defense | Rule |
|---|---|
| Dodge | Affected by encumbrance. May be used multiple times per round. |
| [Acrobatic Dodge] (Special) | Roll vs Acrobatics skill. If you succeed, +2 to Dodge; otherwise -2. |
| [Dive!] (Special) | +3 to Dodge. Only against Ranged attacks. Posture is now Prone. |
| Parry | May only parry an attack from the front or weapon side. Subsequent parries are at a cumulative -4 (-2 if you are using a fencing weapon). |
| Block | May only block one attack from the front or shield side per round. DB only adds to defenses when attacked from the front/shield side. |
| [Retreat] (Special) | Step back 1 hex. +3 Dodge / +1 Block / +1 Parry (+3 Parry with Boxing, Judo, Karate or a fencing weapon) vs 1 Melee attack per round. |
| [Feverish Defense] (Extra Effort) | Pay 1 FP to get +2 to one Defense roll. |

### 2.3 Posture

| Posture | Defense | Melee | Ranged | Move |
|---|---|---|---|---|
| Standing | +0 | +0 | +0 | Move |
| Crouch | +0 | -2 | -2 | 1/2 Move |
| Kneel/Sit | -2 | -2 | +0 | 1/2 Move |
| Prone | -3 | -4 (C) | -2 | 1 yd/hex |

### 2.4 Damage after DR (wounding multipliers, round down)

| Damage type | Multiplier |
|---|---|
| pi- | x1/2 |
| cr / pi | x1 |
| cut / pi+ | x1.5 |
| imp / pi++ | x2 |

### 2.5 Speed/Range modifier

Add range in yards to the target's Move speed (R+M), then read the to-hit
modifier.

| R+M | To hit | R+M | To hit |
|---|---|---|---|
| 0-2 | 0 | 31-50 | -8 |
| 3 | -1 | 51-70 | -9 |
| 4-5 | -2 | 71-100 | -10 |
| 6-7 | -3 | 101-150 | -11 |
| 8-10 | -4 | 151-200 | -12 |
| 11-15 | -5 | 201-300 | -13 |
| 16-20 | -6 | 301-500 | -14 |
| 21-30 | -7 | 501-700 | -15 |

### 2.6 Injury, fatigue, shock and stun

- **Injury.** Below 1/3 HP: half Move and Dodge (round up). 0 HP or below:
  roll vs HT to stay awake (-1 for each full multiple of HT) each round.
  -1xHP: roll vs HT or die.
- **Fatigue.** Below 1/3 FP: half Move, Dodge and ST (round up). 0 FP or
  below: roll vs Will to do anything other than Do Nothing, or collapse.
  -1xFP: collapse.
- **Shock.** Active Defenses -4. On your next turn you must Do Nothing and
  roll vs IQ to "snap out of it", +1 for every turn in Stun (+6 for Combat
  Reflexes).
- **Stun.** Roll against HT to see if you get out of stun. +1 after every
  consecutive roll.
- If you take 1/2 damage or more in a single attack, you must make a health
  save. On a failure you are knocked down and stunned for a turn. If HP will
  become 0, make the injury roll as well.
- If the enemy is knocked down (and there is no special circumstance), a hit
  does not require a roll; skip to damage.

> [OPEN] Knockdown is stated two ways. Here: "1/2 damage or more on a single
> attack". In section 3.3: "more than 1/2 of HP total in a single injury".
> Parked by the GM; to be settled.

### 2.7 To-hit formulas

- **To hit (Melee):** Base Skill + Maneuver/Options + Shock + Situation
  Modifiers + Difference in Size Modifiers (SM) + Posture.
- **To hit (Ranged):** Base Skill + Maneuver/Options + Shock + Situation
  Modifiers + Target SM + Posture + Aim bonuses (if any) + Speed/Range
  Modifier.
- **Missed attack (that may hit others):** roll for each possible target at 9
  (or effective skill, whichever is lower). Keep rolling until you run out of
  targets or hit.

### 2.8 Situation modifiers

| Situation | Modifier |
|---|---|
| Bad footing | -2 |
| Distraction (clothes on fire, etc.) | -2 to -4 |
| Cover | -2 to -4 |
| Darkness | -1 to -9 |
| Blind | -10 |
| Shooting behind cover | -2 |
| Attacking an opponent who is in Close Combat range with another | -2 |
| Grappled | -4 |
| Attacking from above (Melee) | -2 |
| Attacking through an unfriendly hex | -4 |
| Using an improvised weapon | -1 to -3 |
| Above target (Ranged) | +1 |
| Below target (Ranged) | -1 |
| Close Combat (Ranged) | -Bulk, etc. |

The GM can add as many situational modifiers as he deems appropriate. Nen
considerations are an automatic +3/-3 minimum.

### 2.9 Grappling

- First, make a "grapple" skill check (grapple skill + Size Modifier).

> [OPEN] The grappling rule ends here in the source.

---

## 3. Additional mechanics and house rules

### 3.1 Tiers

Opponents who are a tier lower (3D6, 4D6, 5D6) do not get the opportunity to
make any active defences against attacks from an upper-tier character. The
exception is PCs, who can burn an Exceed slot.

### 3.2 Bloodied

At 1/3 HP, gain the **Bloodied** condition. Move and Dodge are the same as
"Injured" (1/2 Move and 1/2 Dodge). No need to roll vs HT to stay awake if PC.

Bloodied:

- Can unlock the **Desperation** condition, which gives x2 damage and +2 to
  attack.
- Can set a limitation on powerful abilities: "Only on Bloodied".
- Enemy bosses will probably have entirely different movesets/playstyles once
  Bloodied.
- Etc.

BLOODIED: -1 HP per turn, and -2 active defences. The HP loss continues until
first aid (see section 9).

If at 0 HP or less, you can make a "Desperation" move freely for 2 turns; it
then costs 15% Aura per turn afterwards.

> [NOTE] GM ruling, 14 Nov 2026: both sets of Bloodied effects apply together
> (half Move and Dodge, and -1 HP per turn with -2 active defences).

### 3.3 Essos counters

If you are a counter to, or weaker against, a certain essos type: on a
successful damage roll, x1.5 damage for a normal counter and x2 damage for an
extreme counter (usually saved for specials).

**Knockdown.** If more than 1/2 of HP total is taken in a single injury, check
for knockdown: roll against HT to see if you get knocked down. Gain the
**Shock** condition.

### 3.4 Damage Resistance

- DR is the natural resistance/defense a person has. A PL0 human will usually
  have DR in the 2-3 range with full chainmail/plate armour.
- An Aura-enhanced user starts with a base of 2 DR, +1 per every 2 levels of
  health past HT 10.
- DR can also be given when an Aura user is "resistant" to another Essos
  type: an additional +2 DR for being a "counter", and +1 DR for being
  normally resistant.

DR can also be gained by trading Aura:

- Some % of total Aura can be traded away for extra **Ablative DR**.

**Ablative DR**

- This is any DR gained that is not your natural resistance starting out
  (including armour).
- Any currency, Aura or ability which "grants" you extra DR is actually
  granting you extra Ablative DR.
- This is DR that, after being subtracted from basic damage, does NOT come
  back (unlike natural DR).

Example: a PC could have 6 natural DR, but spend 30% Aura for +2 Ablative DR
(total of 10), against an attack of 12 basic damage total. Since the PC did
not want to take the full 6 HP loss (after subtracting natural DR), they
decided to spend their own essos (aura) pool worth 30% to increase their
Ablative DR by 2. This means that effectively their DR becomes 10 for this one
interaction, but will go back to 6 natural DR after (unless they keep spending
aura/exceed). This is also the case for abilities which grant extra DR as a
condition, but might be different if the ability changes your actual natural
defences (such as a transformation ability), where you temporarily have an
increased natural DR for the encounter (or as long as the transformation
lasts).

> [OPEN] The arithmetic in this example does not add up as written (6 natural
> + 2 ablative is given as a total of 10). Transcribed as in the source.

**Basic DR templates per Power Level (PL)**

| PL | DR |
|---|---|
| PL 0 | 2 |
| PL 1 | 4-6 |
| PL 2 | 6-9 |
| PL 3 | 9-12 |

**Conditional DR.** DR can be a property of certain abilities, either by
themselves (Essos Shield) or as a side-effect of using another ability. This
is assumed to have the "ablative" limitation unless explicitly stated that it
changes natural DR, in which case the cost of the ability will be much more
expensive.

### 3.5 Posture Break

- If you continuously hit an enemy with subpar damage for their DR, at least 3
  times in a row, their guard is "broken" and they are stunned for 1 turn.
- In this state, any attack, regardless of its damage, bypasses natural DR
  (other types of DR, or DR from abilities, may still apply).
- After a posture break, if the opponent recovers, they lose 2 DR temporarily,
  for the encounter.

### 3.6 Aura

| Spend | Effect |
|---|---|
| 30% Aura | +2 DR (Ablative) |
| 75% Aura | 1 additional Exceed slot |
| 25% Aura | Enhanced Essos Skill: apply a +2 modifier to an attack skill of choice when making an action enhanced by Essos. Cannot stack. Once per action. |

Aura Actions: all "Abilities" which have an associated "Essos Cost" /
limitation.

**Aura recharge:** 15% back after every 3 turns (must maintain the Concentrate
maneuver).

**Aura actions (examples)**

| Action | Cost |
|---|---|
| Abilities with essos | per ability |
| Enhanced Skills (+2 to attack/defence skill checks) | 10% |
| Enhanced Movement (unique movement abilities, flat hex increases, etc.) | 15% |
| Legendary, Lair and Bonus Action (usually tied to abilities/transformations) | 50% |
| Impulse Buys (unlock impulse buys for this encounter) | 10% |
| Enhanced Weapon Damage (+2 damage) | 15% |

> [NOTE] The source uses "Aura" and "Essos" for the same percentage pool. On
> the character sheet this is tracked as two pools, Essos and Reserve; see
> the design document for how the pools behave.

### 3.7 Exceed

3 slots per encounter. Burn a slot to:

1. Gain 25% Aura (unlimited)
2. Gain a Bonus Action (once)
3. Gain a Plot Point (once). Player ONLY, and NO PvP.
4. Gain 2 Advantage (twice)
5. Gain 2 Disadvantage afflictions to apply (max 3)

Advantage and disadvantage cancel each other.

### 3.8 Boost

"Boost" to augment specific maneuvers, or choose an alternative action within
that maneuver (Boost Actions).

100% meter.

Boost-augmentable actions (standard): 25% meter gain when used.

| Action | Meter change |
|---|---|
| All-Out Attack | +1 damage before DR, if not dodged |
| All-Out Defense | -2 |
| Attack | + damage before DR, if not dodged |
| Being stunned | +0 |
| Change Posture | -1 if assuming a lower position |
| Committed Attack | + damage before DR, if not dodged |
| Defensive Attack | +0 |
| Feint | +1 |
| Move | +0 |
| Move and Attack | + damage before DR, if not dodged |
| Retreat | -3 |
| Successful Block | +1 |
| Successful Parry | +1 |

> [OPEN] The Boost meter is a 100% meter with "25% gain when used", but the
> table gives unit-less values (+1, -2, -3) and "+ damage before DR". The
> units and the actual gain per action are undefined. Parked by the GM.

---

## 4. Meta-currencies

### 4.1 Plot Points (PP)

- Awarded by the GM only.
- For an outstanding achievement.
- You get 1 for completing a major story arc.
- ARE NOT "GET OUT OF JAIL FREE" CARDS.
- Sometimes the only outcome of spending a PP is that your character gets a
  more "epic" or "heroic" death, but the outcome is still the same.
- Outcomes can only be fully avoided at GM discretion, or if you can make your
  case well enough to the GM.
- Can only use 1 PP per combat; can use unlimited (your pool) in non-combat.

### 4.2 Flashback Points (FBP)

- A currency based on your intelligence.
- You gain them for every "smart" action/roleplay you do with your PC.
- Awarded only by, and only at, GM discretion.

Costs:

- 2 FBP to use in a combat encounter.
- 1 FBP to use in a non-combat encounter.

**The Flashback mechanic explained.** It can be used to have a "flashback" to
a previous encounter that accounts for the current predicament the PCs are
facing. For example, if there is a guard at the door that the PCs need to get
past, a PC could spend a FBP to narrate how they actually bribed the guard
last night, and that he will let them pass now.

- Extremely helpful for planning/infiltration/co-op type missions, as it
  allows the players to "get right into the action" and skip the planning.
- Helpful for creating "all a part of my plan" moments, especially when
  things are looking dire.
- Must make sense within the fiction. For example, the PC could not say that
  they assassinated the guard last night, as they clearly did not.
- Can also be used to handwave trivial moments in a session: instead of
  roleplaying a standard interaction for information, the player can
  "offscreen" the interaction and just get the relevant information.

---

## 5. Wildcard skills

- More general skills that are not as specific as the skills on the GURPS
  sheet.
- They cover a broader range of expertise, and can be invoked in place of the
  more specific skills.
- If a specific skill is at a higher level, that can be invoked instead if the
  player wishes.

4 wildcard skills are given for free starting out, but they cost CP after
that, and are generally more expensive than regular skills as they cover a
broader range and are thus inherently more useful.

Example wildcard skills: "Essos Mastery", "Beast Tracking".

Some wildcard skills can have further subdivisions (which will be cheaper than
the base skill), but they are meant to be broad and flexible.

In our game we start by choosing 4 wildcard skills, but if we find that our
characters need more, or more niche ones that we forgot to cover, it will be
allowed at GM discretion.

**Wildcard ranks and costs.** Wildcard skills start at attribute-3 for rank 1,
attribute-2 at rank 2, and so on.

| Rank | Level | CP cost |
|---|---|---|
| 1 | Attribute-3 | 3 |
| 2 | Attribute-2 | 6 |
| 3 | Attribute-1 | 12 |
| 4 | Attribute+0 | 24 |
| 5 | Attribute+1 | 36 |
| 6 | Attribute+2 | 48 |

These are quite a bit more expensive than regular skills, and PCs having 4 of
these even at attribute+0 (rank 4) means spending 96 Character Points. This
seems like a bad deal, especially when a PC might already have certain skills
at a high level (martial arts, Karate rank 6, etc.) for a fraction of the
cost. This leaves out that players can create literally any wildcard skill
they want (as long as the GM approves), and that it can cover a skill that is
not currently covered by their character sheet.

**Wildcard Points.** For every 12 CP spent, due to the "Hyper Competency"
rules, players gain 1 Wildcard Point. Wildcard Points can be used as a
"Karma-free" currency to purchase rerolls and "fleshwounds", as well as
anything that is usually covered by Karma (aside from being able to purchase
character points).

**Wildcard skills to use** (list from the source):

- "Infiltration"
- "Martial Arts"
- "Essos Manipulation"
- "Battle Prowess"
- "Spirit!"
- "Negotiation"
- Trial Contestant!
- Essos User!
- A background wildcard
- Etc.

---

## 6. FATES system — Under rework

Every character has a number of Fates.

A new character has one at Rank 2 and one at Rank 3 (Fates work like skills,
so they are ranked from 2 to 5). In addition to the two you pick for yourself,
the GM picks an extra Fate for each character regarding their Destiny.

Fates are the emotional core of who a character is and what drives them. They
are the PC's goals, beliefs, and the way they live their lives.

Fate examples: Misfortunes, Emotions, Enemies and Rivals, Secrets, Loves,
Taboos.

### 6.1 Dharma and Karma

- Every time the PCs roleplay their Fates, they gain 1 **Dharma**. Anyone can
  award Dharma, not just the GM. The only requirement is that more than 1
  Dharma cannot be awarded for the same scene.
- Dharma can be spent on: Character Points, Fleshwounds, Rerolls, nudges, and
  more.
- Fleshwounds reduce incoming damage after DR by 1/2.
- Dharma spent turns into **Karma**, which accounts for all spent Dharma.
- Never let your Karma reach 108 points. Your character will lose their mind
  from their attachments/desires and become an "Asura": a being that is no
  longer human and only consumed by its desires. They effectively become NPCs
  and can no longer be played, but they might return as enemies to the party.

---

## 7. Healing and recovery

### 7.1 First Aid

- Players or NPCs with the "First Aid" wildcard skill can attempt a skill
  check against it to patch themselves or allies up. This removes conditions
  such as "Bloodied", "Major Wounds", and all health/injury-related
  afflictions that can be cured without magic.
- Players with the skill can also recover hit points; however, the skill stops
  recovering HP after the negatives. Once a PC/NPC recovers HP past 0 HP, the
  First Aid wildcard skill cannot recover any more.

"First Aid" is necessary for removing negative health conditions and
afflictions, as well as healing someone unconscious or on the brink of death
back to a more salvageable condition. What it cannot do is "heal back" lost
hit points past 0 HP.

WHEN BLOODIED: -1 HP per turn, until first aid.

### 7.2 Recovering HP past 0

- Normally, a PC recovers 1 HP per day, for every "fully rested" day of
  recovery. This speeds up to 2 HP/day for non-magical professional medical
  recovery (hospitals, infirmaries, etc.).
- A PC's healthcare provider can also roll against their health skill (normal
  DC of 14) per day the PC is in their care, to gain a +2 boost of HP.
- Magic can also be used to heal HP. A "Healer" is a magical/Aura user who
  specializes in abilities pertaining to curing mortal wounds, speeding up
  recovery, and performing supernatural feats of healing. Healers can roll
  against their magical healing skill, or use an ability of theirs which
  inflicts healing (with an accompanying HT roll, if needed for the ability).
- Either way, healers can heal potentially up to +4 HP in a single day, at
  least. Some healers can heal that much in a single action. It depends on the
  skill level of the healer, as well as the nature of the injury.

### 7.3 Health potions and ointments

- Magical items can be purchased, if available in the setting, that heal a
  fixed amount of HP per bottle (4-6 HP for common potions).
- If they are too difficult/rare to purchase in the setting, they can be
  crafted, depending on whether the PCs have the necessary ingredients as well
  as skill in potion-making. If not, they may simply gather the ingredients
  and take them to a more experienced sage who can create them.
- Health-related magical items/potions heal depending on the potency of the
  ingredients (if crafting) or on the rarity of the item (if buying). Some
  high-level potions can be made from pure Aura crystals, for example, which
  are the highest grade quality.

Overall, healing is harder than expected, and also far riskier, as it comes
with either a steep cost or a lengthy crafting process. These processes can of
course be simplified, by either purchasing the manufacturing process or
creating one's own. That is advanced, however, and is beyond the scope of
healing.

---

## 8. XP and advancement

**2 XP = 1 CP.**

- You get 10 XP for showing up to the session.
- You get to vote on who had the best moments/best roleplay that session, if
  more than 2 players attended (you cannot vote for yourself). The poll is
  done on Discord, and first place gets 8 XP.

Worked example from the source (session notes):

- 10 + 8 + 50 = 68 XP / 2 = 34 CP (for both Ahad and Mukund)
- 10 + 3 = 13 XP / 2 = 6.5 CP
- 12 XP

**Monsters:** Deprecated.

### 8.1 XP for defeating enemies

| Enemy | XP |
|---|---|
| "Minion" enemy NPC | 4 |
| "Low tier" enemy NPC | 8 |
| "Semi-Important" enemy NPC | 12 |
| "Important" enemy NPC | 16 |

### 8.2 XP for failed skill rolls — Deprecated

Every skill roll you fail (if unlearned, attribute-4; 4 CP to learn it at
level 1, which just equals attribute): you gain 6 XP, AND you gain 2 free CP
to spend on THAT SKILL ALONE.

### 8.3 Training

| Training | XP |
|---|---|
| Any type of training | 12 |
| Trained with a teacher/mentor | 20 |
| Trained with a master | 32 |

Your XP can only be used as CP on the actual skills you trained. If it is
general training, you can convert the XP to "Training Points".

**10 Training XP = 2 Training Points.**

**Training Points**

- A metacurrency used to purchase specific "abilities", "feats" and "skills"
  that have the prerequisite condition of requiring training points to
  purchase them.
- Training points can only be used to improve stats and skills that were
  specifically trained for. If you trained for ability A, you cannot then
  spend your points on ability B. If it was a more general training, then GM
  discretion.

General vs specific training:

- General training can allow you to buy any abilities, skills and feats at GM
  discretion, at normal cost.
- Specific training allows you to buy abilities, skills and feats at a
  "discounted" cost. The discount is up to GM discretion, but for tier 1
  abilities/feats it can be quite a significant discount (50% or more).

### 8.4 Milestones

Starting at 100 XP flat, milestones are story-specific moments that mark the
end of a character's personal or group arc. If all the players were in a party
and all went through a quest/story arc, they all gain the same flat XP bonus.
If separated, only the relevant player gets the bonus.

| Milestone | XP |
|---|---|
| Small/Mini arc | 25 |
| Regular Arc/Quest | 50 |
| Story Arc (e.g. Trial of the Heavens) | 100 |
| Major Story Arc / Major Character Arc | 200 |
| Series of Arcs or a saga (will include a time jump) | 600 |

**Group incentive.** Milestone XP is DOUBLED (x2) for major story arcs
accomplished by the entire group (all PCs in a formalized group). This is akin
to "group XP".

If you progress in any of your FATES, you gain 12 XP.

**Summary.** You gain XP, which is a 2:1 relation to CP. You can gain XP by:

- Defeating enemies
- Joining a session
- Ending major personal character arcs
- Completing

> [OPEN] The summary list ends at "Completing" in the source.

### 8.5 Events

Arcs are an important part of the PC's journey, in which the most development
and XP will be rewarded. After the first major Arc, EVENTS open up for PCs to
access, allowing for XP bonuses, items and rewards of interest to the PCs.
EVENTS are timed and are only available while on the EVENT board, and players
can only access EVENTS if they have the requisite skills, rank or
qualifications. For example, there may be an EVENT that requires the
investigation of a murder, in which the PC is asked for a certain skill (kind
of like a job application). EVENTS are listed by NPC, and some are gate-locked
depending on the PC's connections. EVENTS do not need to be related or
important to the player story but can be; EVENTS that are will be listed as
"(possible story Arc)".

| Tier | Kind | Rewards | Description |
|---|---|---|---|
| TIER 1 | Simple EVENT | Minor rewards, 40 XP | Usually can be considered a set of minor quests in a major Quest. |
| TIER 2 | Task or Job Hiring | Intermediate rewards, 55 XP | Can be minor or large depending on the task and how the PCs approach it. |
| TIER 3 | Special Requests | Intermediate to great rewards, 65-77 XP | Not available to the public. Require special ranks or Essos Skills. Usually dangerous jobs or series of quests that place PCs in danger for high risk, high reward (assassinations and bodyguard work are common examples). |
| TIER 4 | Duty actions | Great to insane rewards, 80 XP | Long and usually listed as Arcs. May require lesser to larger qualifications. Usually extreme EVENTS that require a huge number of individuals and in many cases ESSOS masters (professionals). These EVENTS usually turn into arcs and can affect the World; they can also be long adventures or even mass events of war. |
| TIER 5 | The highest EVENT possible | Ultimate rewards, 300 XP | Always Story Sagas, and extremely dangerous. Qualifications may not be necessary, but all PCs must agree. Usually unavailable, since they are not listed on the EVENT board; the player creates the EVENT. It has to be an extreme PC choice, for example declaring war, invasions or dangerous long-run PC goals. |

NOTE: TIER 4 and 5 are usually used to start major arcs.

---

## 9. Combat systems

There are 3 major combat systems:

1. Grid-Based Combat
2. Cinematic Combat
3. Deck Combat

**When to use grid combat?** The majority of the time, for average/challenging
foes, and for mooks (although real mooks would be purely narrative). It is
best suited for situations where the GM wants to emphasize the "deadly" and
"short" nature of combat, as turns are only 1 second long in GURPS, and most
fights are over in 10-20 turns (1/4 of a minute).

**When to use cinematic combat?** The most flexible one. It can be used for
any situation but works best in more dramatic combat encounters, or encounters
where the GM wants to emphasize the "chaotic" nature of combat more, which
grid-based combat cannot emulate. Can be used for groups, for 1v1s, or
anything else.

**When to use deck-based?** Only 1v1s. Whenever the GM wants to switch things
up, and be more of a "player" in the combat.

**What % of time should be spent on each?** Rough guideline, no hard rules:

| System | Share |
|---|---|
| Grid-Based | about 50% |
| Cinematic | 30% |
| Deck | 20% |

> [OPEN] Deck combat has no rules in the source. Placeholder only.

### 9.1 Cinematic battles

Certain key fights might be tagged as important/crucial for a character's
story arc, whether for the overall plot or their own personal struggle.

In this mode, the battle takes place entirely in the "theatre of the mind",
removed from any grids or tokens.

Cinematic battles may not be the entire battle, but can also just be a
"segment" of a battle that is otherwise normal combat.

**Rules for cinematic battles.** As minimal rules as possible. The GM should
strive to only narrate and frame the situation and battles. It should be fun,
fast and action-packed, with minimal rolling or number crunching. That said,
if a situation is extremely unambiguous, then a roll can be made.

1d6 is rolled, ONLY for the player.

| Result | Outcome |
|---|---|
| 6 or greater | Failure/Miss |
| 4 or 5 | STRONG Success/Hit |
| 3 or lower | WEAK Success/Hit, BUT you can choose to roll another 1d6, with the condition that you must ADD it to your result. |

**Scenario Advantage.** After considering all the variables (physics,
narrative, genre, characters), the GM may assign a "scenario advantage", which
acts as a -2 modifier to the roll on a 1d6. This can be applied to the
additional 1d6 rolled after weak successes, or to the original roll, whichever
is best for the player.

**Stress.** A player may be allowed to reroll any result, with the caveat that
they must gain a point of "Stress". For every 2 Stress collected, the player
must roll on the Stress Table with 1d6.

| 1d6 | Stress Table result |
|---|---|
| 1 | Gain Injury |
| 2 | Gain Injury |
| 3 | Gain Resolve |
| 4 | Gain Fatigue |
| 5 | Gain Fatigue |
| 6 | Gain Doubt |

- **Injury:** gain 3 Injury and you lose.
- **Fatigue:** gain 5 Fatigue and you lose. Once you have 3 Fatigue, you gain
  1 extra Stress for every reroll.
- **Resolve:** you lose a Fatigue.
- **Doubt:** you become indecisive, leading to an opportunity for your
  opponent.

### 9.2 Extra considerations

1. If an enemy has an ability that the PCs are unaware of, the GM does not
   need to disclose it. If it is something that can be reasonably gleaned from
   battle, PCs should make an "Evaluate" action on their turn to see if they
   can decipher the enemy's abilities. The GM can roleplay this in game, as a
   character "monologuing" in their head, etc. If this is not an ability that
   can be reasonably gleaned from battle, a PC cannot exit combat and try to
   make a normal sense or perception check. If it is not something that can be
   reasonably perceived or sensed, then it is information PCs cannot know,
   period. The GM is advised not to unnecessarily give away enemies'
   abilities, unless it is a matter of life or death (poison touch, not known
   by PCs).

   **Evaluate action:** in the heat of battle, a PC can make an Evaluate
   action to gain insight into an opponent's fighting style (if possible).
   They gain +2 on their attacks on the target for the next turn.

   If PCs do not know an ability or attack, they cannot make active defenses
   (dodge, parry, block) against it.

2. For faster encounters: make enemies do "all-out attacks" instead of normal
   attacks, so they do not get to roll defences.

---

## 10. New maneuvers

### 10.1 Extra Effort: Attack!

- You roll Will, or a relevant Will-related skill roll, after your Attack
  roll. The opponent's defense roll does not matter.
- This is a variation of the all-out attack, where you may not use passive OR
  active defenses for **3 rounds** after its use.
- Once the attack hits and the willpower roll is made successfully, the
  opponent gets no opportunity to roll their defenses, and their DR is capped
  to a reduction of 2.
- Damage is as normal; however, the attacker may volunteer to "boost" the
  damage by spending 1 FP for every extra point of damage.
- If the user fails their willpower roll, they may still use the attack, but
  with a -4 penalty.

### 10.2 All-Out Attack: Reckless!

Another all-out attack, where the attacker may not use passive defenses after
the maneuver, for the next turn.

- Attacker gets +4 to attack skill.
- Defender gets +2 to defenses.
- The attacker rolls his attack skill as usual; however, on a successful hit
  he MUST sacrifice 2 HP, regardless of whether the opponent succeeds or fails
  their passive defence roll.
- If the defender succeeded on their defense roll, the attacker can pay 2 FP
  to mitigate the health penalty.
- If the attacker succeeds, he can NOT mitigate the HP penalty.
- For damage: the attack ignores all Ablative DR for the cost of 1 FP, or 1/2
  Ablative DR for free.

Example: an enemy has natural 2 DR but spends 50% Aura to get +4 Ablative DR,
which makes the enemy's effective DR 6. HOWEVER, against an opponent who
succeeds on a "reckless attack", if he fails his defence roll he may only have
an effective DR of (4/2 + 2). In addition, if the attacker opted to spend an
FP to ignore all Ablative DR, the defender is left with only their natural DR,
which is 2.

### 10.3 All-Out Defense: Tactical Retreat

Spend a turn on this move. Gain +4 against attack rolls against you for the
next 2 turns, as well as x2 movement for retreating purposes only. Enemies who
would usually get "opportunity attacks" on you do not when you use this
maneuver.

### 10.4 All-Out Defense: 3D Awareness

Spend 1 FP to make ALL flank/rear attacks incur no penalties to defence, and
spend another 1 FP to gain +1 on your own defences against these types of
attacks. Attackers who attack from the rear on someone who chose 3D Awareness
also suffer an automatic -2 to their rear attack, and -4 to their flank
attacks.

### 10.5 All-Out Attack: Long

- Increases the reach of the weapon by 1, but swing damage is less.

### 10.6 Defensive Attack

Penalty to damage, but +3 to defenses.

### 10.7 All-Out Concentrate

+3 to all "concentrate"-related rolls. May not defend next turn.

> [OPEN] 10.5 and 10.6 do not state how much damage is lost.

---

## 11. Reworked hit locations

All hit-location attacks must first be called, as a "called shot".

| Location | To hit | Effect |
|---|---|---|
| Head | -7 | Damage to the head is x2, stacking with weapon damage. |
| Eyes | -9 | If the eyes take more than 2 damage, they are blinded. |
| Neck | -8 | If damage exceeds 1/2 the target's health, instant decapitation. If less, GM fiat on what happens. |
| Body | 0 | No special effects; normal weapon effects. |
| Limbs (arms) | -3 | To hit a specified limb. If damage exceeds 1/2 the target's total health, the limb is crippled, but damage is capped at that value. |
| Limbs (legs) | -4 | If damage exceeds 1/2 the target's total health, the limb is crippled, and the target needs to roll to see if it is lame. If lame, the target may not use the leg. |

> [OPEN] The legs rule stops mid-sentence in the source ("If dmg is in").
> Parked by the GM.

---

## 12. Non-combat modifier guidelines

Two systems can be used: the Basic Task Difficulty system and the BAD system.
Task Difficulty depends on the task in question. BAD can also be used for
tasks, but is meant to be more general, describing how "bad" things are for
the PCs.

### 12.1 Task Difficulty chart

| Modifier | Task |
|---|---|
| +10 | Automatic |
| +8 | Trivial |
| +7 | Very Easy |
| +6 | Easy |
| +3 | Favourable |
| +1 | Slightly Favourable |
| 0 | Average |
| -1 | Slightly Unfavourable |
| -2 | Unfavourable |
| -4 | Hard |
| -6 | Very Hard |
| -8 | Dangerous |
| -10 | Impossible |

> [NOTE] The +1 row reads "Slightly Unfavourable" in the source, duplicating
> the -1 row. Transcribed as "Slightly Favourable"; confirm with the GM.

### 12.2 Degrees of success and failure

Sometimes success/failure is not a binary yes/no situation. In those cases,
the GM may still ask for a roll to accomplish the task, but also look at the
"degree" to which the PCs succeeded or failed.

For example, if a PC attempts an unfavourable task (-2) of repairing a broken
radio and fails, but only by a margin of 1, the GM may rule that they
accomplished the task, but with some issue/problem not foreseen by the players
(it will take more time to do, malfunction after some duration of use, etc.).

In the same way, for more nuanced tasks the GM may allow "failures" with a
huge margin of failure to be even more catastrophic in scope (failure by a
margin of greater than 5, for example), and successes by only a margin of 1 or
2 to be "conditional" on some basis.

**Time Spent.** You can reduce the difficulty of a task by spending more time
on it, and with the help of more manpower. For example, if instead of trying
to fix the radio in one evening I spent a day on it, with 2 other buddies whom
I paid for the job, it could go from an Unfavourable task (-2) to an Easy task
(+6).

**Non-combat use of combat skills.** Players may want to use their combat
techniques (brawling, judo, karate, broadsword, axe, innate attacks) in
non-combat situations. In those cases, assume a minimum of "favourable"
conditions to use them, unless the conditions are literally not favourable.

### 12.3 System 2: BAD

Instead of evaluating things on a task-by-task basis, the GM can consider how
"BAD" the situation is for the players. As an alternative to detailed
modifiers, the GM can set a single difficulty — the Basic Abstract Difficulty
(BAD) — that covers all aspects of a particular phase of the adventure. This
is a penalty from 0 to -10 that replaces detailed situational modifiers. The
only other modifiers that apply are those the PCs bring into the picture:
bonuses for equipment, penalties for disadvantages, etc.

**How "BAD" is it?** The GM can pick whatever BAD "feels right". When rating
how challenging specific opposition is, though, he might opt to calculate it
as follows: rate the adversaries' basic point value as an Enemy (p. B135),
divide by 4, and drop fractions.

Enemy henchmen (NOT mere mooks) can be calculated by assuming an effective
skill of 10 + the absolute value of the main antagonist's BAD.

Example: the enemy bandit king has an enemy score of -5, which divided by 4 is
1.25, which rounded down is 1. Therefore we can assign the bandit king an
overall BAD score of -1, which means all dealings and tasks related to
thwarting the bandit king get an automatic -1 assigned to them. This extends
to dealing with his henchmen (NOT mooks), who will have an effective skill of
11 when dealing with players. This is calculated by taking the base skill of
10 + |-1|, which = 11.

Enemy score modifiers are based on GM fiat, but a good mathematical guideline
is to add +5 to each "level" of greater BAD.

| Threat level | Enemy score | BAD |
|---|---|---|
| Lvl 1 | -5 | -1 |
| Lvl 2 | -10 | -3 |
| Lvl 3 | -15 | -4 |
| Lvl 4 | -20 | -5 |
| Lvl 5 | -25 | -6 |
| Lvl 6 | -30 | -8 |

> [NOTE] The table values are as in the source. They do not follow the
> divide-by-4 rule exactly (for example -10 / 4 would give -2, not -3); a
> later passage gives the formula (-5 x N) / 3.

**How to apply BAD?** BAD modifiers should represent how BAD things have
gotten in a situation, so each "level" of BAD can go up or down depending on
how the PCs influence the situation. For example, once the PCs defeat the
bandit king, the "threat level" goes back from level 1 to 0, so his henchmen
also go down from skill 11 to 10 (if they do not just run away).

It could also be the opposite: as the PCs uncover more secrets about the mad
scientist and find out his final plan, he is made aware of it, causing the
"threat level" to increase a level (say level 2), and the BAD modifier to go
from -1 to -3.

**Can BAD stack with Task Difficulty?** Usually no, SOMETIMES YES. If the GM
really wants to emphasize that the situation is BAD, he can assign a BAD
level, based on the threat level, ON TOP of the actual Task Difficulty.

Example: the players want to sneak past an enemy who is actively hunting them
down. This situation is BAD, as the threat level is level 2 (-10). Also, the
GM decides that since the hunter is actively looking for the players, it is
not a normal situation, so he states that the task itself is "Unfavourable"
(-2). Therefore, to sneak past an enemy who is actively hunting them, the
players take their Sneak skill (assume 13) and modify it with the BAD score
AND the Task Difficulty:

SL (13) - [BAD (-3) + Task (-2)] = 8. The players need to roll 8 or less.

**What about combat?** Combat modifiers are in play (range, maneuver effects,
etc.) to act as the modifier. The GM can also include the BAD modifier in the
equation, to simplify the number of variables he takes into account. This
template of "threat levels", (-5 x N) / 3, can be used in any way the GM
wants, where N = threat level.

### 12.4 Issues modifier system

Similar to BAD, it is not about any specific task, but something you can apply
in a given situation as a general modifier, without keeping track of the
physics of a situation.

It is more specific than the BAD system: it is for moments where the GM wants
to highlight a specific variable, without needing to reference the exact
modifier or chart. The issues system also assumes no physics, and is only a
static "account" of the various variables; it does not consider their
interactions, motion or gravity.

How does it work? The GM only introduces the modifier when he wants to signify
that it is an actual variable and not something to just handwave. There are 3
levels of issues:

| Intensity | Modifier |
|---|---|
| Minor issue | -1 |
| Normal issue | -3 |
| Major issue | -5 |

The GM should not go crazy with "issues" modifiers (no more than 1-2).

> [OPEN] This sentence ends with "or" in the source.

Since issues can be any particular variable, an exhaustive list is not
possible, but some usual considerations are: Range, Duration, Vision, Speed,
Balance, Reaction, Strength, Guard, Encumbrance, Fatigue, Elemental, Weather,
Reputation, Time, Non-Proficiency and Morale issues.

Once you have identified the issue you want to highlight, specify its
intensity: is it a minor issue, a normal issue, or a major issue?

Example: it is a dark cave, where you can barely see your surroundings (major
vision issue, -5). However, if you have a torch, you can better make out the
details of the cave (it becomes a minor vision issue, -1).

Issues can stack: if a situation has multiple issues the GM could highlight,
at differing intensities, he may choose to highlight multiple issues.

---

## 13. Essos

All essos users have the "Essos" Advantage, which costs 5 CP for Level 0, then
[10 CP] for each increase after. The max starting Essos Advantage is 0.

(Awareness of Essos, and my type.)

Each Ability, in addition to its regular CP cost, is gated behind a certain
level of Essos [10].

The advantage has the wildcard skill "Essos-User" attached to it, which is a
skill about general character uses and applications of essos.

**Wildcard skill.** Its SL is IQ + WILL + SENSE / 3, round down. This number
is your base "Essos" attribute, which can be further modified by the skill
level you have in the "Essos-User" skill.

| CP | Essos-User rank | Level |
|---|---|---|
| 3 | 1 | Essos - 3 |
| 6 | 2 | Essos - 2 |
| 12 | 3 | Essos - 1 |
| 24 | 4 | Essos |
| 36 | 5 | Essos + 1 |

This then gives you your Essos-User SL, which is further modified by your
"Essos" Advantage level. All PCs with essos start with an essos advantage of 1
(5), but further levels of the advantage cost [10], with the max level being
5. Starting out, the maximum essos advantage one can take is essos advantage
1.

> [OPEN] The source gives the starting Essos Advantage as "Level 0 for 5 CP,
> max starting 0" in one place and "advantage of 1 (5), max starting 1" in
> another. The formula is also ambiguous between (IQ + WILL + SENSE) / 3 and
> IQ + WILL + (SENSE / 3).

The Essos Advantage acts as:

1. A modifier for skill checks and ability checks based on the Essos-User
   skill.
2. A modifier for "learning" and "identifying" things with essos.
3. A "gate" on certain abilities and "trees". You must first have the
   advantage level to meet the requirement.

For learning, sense and detection uses of Essos, use the "Essos-User" skill +
Essos Advantage level.

For combat-related skills/applications of Essos, you will NOT be using the
Essos-User skill; rather you will be using a specific "Ability" under your
essos "Power".

Essos abilities can have attack skills associated with them, particularly if
they are offensive abilities. For essos-attacking abilities, depending on the
ability you may or may not need to roll; if you need to roll, the default is
your Essos-User Skill - Essos Talent Modifier.

For example, as an emissions user, any ability using emission has a talent
modifier of 0, as it is my natural type. If, however, I use a conjugation
ability, which is at the opposite side of the pentagon, I gain a -3 Essos
Talent modifier, making my effective SL in that ability my Essos-User Skill -
3.

**What happens if I fail an essos check?** Depending on the situation, it
could be nothing or deadly.

- Generally, if you fail the check in non-combat, you just will not accomplish
  the task you wanted, but depending on the "degree" of success or failure
  (see section 12.2) the GM may allow for partial successes.
- A failed essos skill check in combat usually means that a player failed
  their essos-ability skill check. Their ability does not work that turn, but
  they may try again, if conditions permit, in a later turn.
- If the ability in question had some type of limitation associated with it,
  the effects of the limitations still hold (limited use, cost in Aura or
  fatigue, self-imposed limits, etc. are all still in effect).
- At an essos advantage level of 2, the essos user may pay 1/2 Aura to negate
  the costs of the ability, but the check is still a failure.

### 13.1 Abilities

> [OPEN] Heading only; no content in the source.

---

## 14. Downtime

### 14.1 Downtime activities

Examples (not conclusive at all): Farming, Fishing, Crafting, Gathering,
Training, etc.

Can be simulated through a Discord text channel. PCs get 3 actions/turn.
Choose from a list of options, perhaps. Each downtime activity has its own
progress trackers and milestones. Can also act as a way to AFK skill-up.

### 14.2 Downtime expanded: the Time-Lock system

Between major sections of a story arc or saga, players gain the opportunity to
invest their time in a variety of meaningful activities. Unlike standard
downtime (crafting, fishing, gathering, etc.), this downtime focuses on
narrative impact, character development, and decision-making that shapes the
arc itself. This special downtime is called **Time-Lock**.

During a Time-Lock, players face a **set deadline** or **approaching event**.
They can choose how to spend their limited time, balancing between
story-driven, relationship-driven, or miscellaneous activities. Each choice
pushes the timeline forward, sometimes even accelerating or delaying the
deadline itself.

The Time-Lock system creates tension similar to Persona 5's calendar mechanic, where
each decision carries weight and the flow of time is a limited resource.

**1. Time as a resource**

- Players typically have **1-2 activities per downtime cycle**.
- These activities can be story-related (investigating, gathering allies,
  espionage), personal (character growth, relationships), or miscellaneous
  (training, crafting, relaxation).
- Every choice matters: it may bring the party closer to success, or closer to
  disaster.

**2. Time-Rush**

At any point, certain choices may **accelerate the deadline**. This is called
a **Time-Rush**.

- A Time-Rush represents unforeseen complications caused by the players'
  actions.
- Example: investigating too aggressively alerts the enemy, moving up the
  villain's plans.

**3. Dread Lock**

A **Dread Lock** is triggered when a player engages in a **risky activity**
during Time-Lock.

- While under the Dread Lock, every action risks bringing the deadline closer
  and may introduce dreadful consequences.
- The Dread Lock represents rising tension, looming danger, or the enemy
  tightening their hold.

**4. Lantern Evenings (Red, Yellow, Green)**

Occasionally, a **Lantern Evening** arises during a Time-Lock. This is a
special event window that allows players to take **one additional action**
beyond their normal limit. There are three types:

- **Red Lantern:** risky. Poor choices may lead to severe or catastrophic
  consequences.
- **Yellow Lantern:** neutral. An additional action with no strong positive or
  negative impact.
- **Green Lantern:** fortunate. Even if a player missteps, no negative
  outcomes will occur.

Lantern Evenings create rare opportunities for decisive action, or great
peril.

**5. Second Light**

The ultimate reward of the Time-Lock system. **Second Light** represents a
breakthrough, a reality-bending shift that changes the course of the saga.

Second Light can be achieved when:

1. A player opens a new path or possibility that was previously impossible in
   the arc.
2. A player's choices create a **major unifying impact** on the story.
3. The party unites together under a common cause, reshaping the arc's
   direction.

Second Light ensures that players are not simply reacting to doom or
desperation, but instead have the chance to **forge their own hope**, turning
the campaign toward brighter possibilities.

---

## 15. Planned systems (headings only in the source)

- **Retainer Protocol:** a follower overhaul system.
- **Relationship System**
- **World of survival**

> [OPEN] No rules written yet for any of these.

---

## Appendix: open items at a glance

Parked by the GM, to be settled later:

- Boost meter units and gain per action (3.8)
- Knockdown threshold: two different wordings (2.6 and 3.3)
- Hit locations: legs rule cut off (11)
- Fates: under rework (6)
- Deck combat: no rules yet (9)

Found during transcription, not yet raised with the GM:

- Concentrate roll reads "WILL-3 2" (2.1)
- Grappling stops after the first step (2.9)
- Ablative DR example arithmetic (3.4)
- Damage penalty amounts for All-Out Attack: Long and Defensive Attack (10)
- Task Difficulty +1 row label (12.1)
- BAD table values vs the stated formulas (12.3)
- Issues system sentence cut off (12.4)
- Essos Advantage starting level and the Essos-User formula (13)
- Essos Abilities section empty (13.1)
- XP summary list cut off (8.4)
- Retainer Protocol, Relationship System, World of survival: headings only (15)
