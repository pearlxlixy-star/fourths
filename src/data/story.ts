import type { StoryNode } from '../types'

/**
 * The branching story. Each choice changes the character's stats and decides
 * which scene comes next, so two players rarely see the same five scenes.
 *
 *   drop / invite / forgot          (picked by the survey)
 *        |             \
 *   payday_free     payday_plan
 *        |      \    /     |
 *       sale    stack    missed
 *        |    /   |   \    |
 *     emergency         crunch
 *            \         /
 *              finale -> end
 */
const NODES: StoryNode[] = [
  {
    id: 'drop',
    title: 'The sneaker drop',
    text: 'The sneakers you have wanted for months just dropped. $160. Checkout offers 4 payments of $40.',
    choices: [
      { label: 'Split it in 4', result: 'They arrive Friday and look great. $160 is now waiting for you in four pieces.', fx: { joy: 15, debt: 160, calm: -5 }, next: 'payday_plan' },
      { label: 'Wait and save for them', result: 'It stings to close the tab. But nothing new is owed, and the next drop is in two months.', fx: { joy: -5, calm: 6 }, next: 'payday_free', wise: true },
      { label: 'Buy a $60 pair instead', result: 'Not the dream pair, but they are yours and fully paid.', fx: { wallet: -60, joy: 8 }, next: 'payday_free' },
    ],
  },
  {
    id: 'invite',
    title: 'The group trip',
    text: 'Your friends are booking a weekend away. $220 each. The booking site offers pay-later.',
    choices: [
      { label: 'Book it, pay later', result: 'Best weekend in ages. The $220 comes due after the photos are posted.', fx: { joy: 18, debt: 220, calm: -6 }, next: 'payday_plan' },
      { label: 'Say your budget is $80', result: 'A little awkward for ten seconds. Then two friends admit they are relieved, and you all pick a cheaper plan.', fx: { wallet: -80, joy: 10, calm: 4 }, next: 'payday_free', wise: true },
      { label: 'Skip this one', result: 'You watch the stories from your couch. Your balance did not move.', fx: { joy: -10, calm: 2 }, next: 'payday_free' },
    ],
  },
  {
    id: 'forgot',
    title: 'The surprise charge',
    text: '$45 just left your account for a plan you forgot about. Your balance is lower than you thought.',
    choices: [
      { label: 'Write down every payment date tonight', result: 'It takes twenty minutes. Now you know exactly what leaves and when.', fx: { wallet: -45, calm: 10 }, next: 'payday_free', wise: true },
      { label: 'Shrug, it will be fine', result: 'It is fine, this time. You still do not know what leaves next week.', fx: { wallet: -45, calm: -8 }, next: 'payday_plan' },
      { label: 'Cancel a subscription to make room', result: 'One less thing leaving every month. $12 back in your wallet.', fx: { wallet: -33, calm: 5 }, next: 'payday_free' },
    ],
  },
  {
    id: 'payday_plan',
    title: 'Payday, with strings',
    text: 'Your $300 paycheck lands. Two payments are due this week, $80 in total.',
    choices: [
      { label: 'Pay them first, then plan the rest', result: 'Both clear. What is left is truly yours to spend.', fx: { wallet: 220, debt: -80, calm: 8 }, next: 'sale', wise: true },
      { label: 'Treat yourself first', result: 'Dinner out and a new game. On Thursday a payment tries to leave and the money is not there.', fx: { wallet: 180, joy: 12, calm: -10 }, next: 'missed' },
      { label: 'Pay double to finish early', result: 'A tight week, but one whole plan is gone for good.', fx: { wallet: 140, debt: -160, calm: 12, joy: -4 }, next: 'sale', wise: true },
    ],
  },
  {
    id: 'payday_free',
    title: 'Payday, wide open',
    text: 'Your $300 paycheck lands and nothing is due this week.',
    choices: [
      { label: 'Move $100 to your goal first', result: 'It is gone before you can miss it. The goal bar jumps.', fx: { wallet: 200, saved: 100, calm: 8 }, next: 'sale', wise: true },
      { label: 'Celebrate with a big night out', result: 'A great night. $90 lighter by morning.', fx: { wallet: 210, joy: 15 }, next: 'sale' },
      { label: 'Start a plan for a $480 phone', result: 'The new phone is beautiful. Eight payments of $60 just joined your calendar.', fx: { wallet: 300, debt: 480, joy: 14, calm: -8 }, next: 'stack' },
    ],
  },
  {
    id: 'sale',
    title: 'The 40% off email',
    text: 'A jacket you looked at once is $120 today only. The email has a countdown timer.',
    choices: [
      { label: 'Sleep on it', result: 'By morning the timer has reset and you do not want the jacket anymore.', fx: { calm: 6 }, next: 'emergency', wise: true },
      { label: 'Buy it from your wallet', result: 'Paid in full. It is a nice jacket.', fx: { wallet: -120, joy: 10 }, next: 'emergency' },
      { label: 'Pay later, keep the cash', result: 'Your wallet looks the same. Your calendar has four new dates on it.', fx: { debt: 120, joy: 10, calm: -6 }, next: 'stack' },
    ],
  },
  {
    id: 'missed',
    title: 'The bounced payment',
    text: 'A $40 payment did not clear. There is an $8 late fee and an email with a red subject line.',
    choices: [
      { label: 'Pay it now and set reminders', result: 'Fee paid, lesson kept. Your phone will warn you two days ahead from now on.', fx: { wallet: -48, debt: -40, calm: 4 }, next: 'emergency', wise: true },
      { label: 'Ask them to move the date', result: 'One chat message. They move it to after payday.', fx: { calm: 6 }, next: 'emergency', wise: true },
      { label: 'Ignore the email', result: 'The fee is added to what you owe. A second email arrives.', fx: { debt: 8, calm: -15 }, next: 'stack' },
    ],
  },
  {
    id: 'stack',
    title: 'Three plans at once',
    text: 'You count them: three plans, three apps, $130 leaving this week across all of them.',
    choices: [
      { label: 'Put them all on one list', result: 'Seeing every date in one place is not fun, but the knot in your stomach loosens.', fx: { wallet: -130, debt: -130, calm: 10 }, next: 'emergency', wise: true },
      { label: 'Open one more, for groceries', result: 'Dinner is sorted. Now there are four.', fx: { debt: 90, calm: -12 }, next: 'crunch' },
      { label: 'Sell something you do not use', result: 'The old console goes for $70. It covers half of this week.', fx: { wallet: -60, debt: -130, joy: -3, calm: 6 }, next: 'emergency' },
    ],
  },
  {
    id: 'emergency',
    title: 'The cracked screen',
    text: 'Your phone hits the pavement. The repair is $150 and you need it for work.',
    choices: [
      { label: 'Use savings. This is what they are for', result: 'It hurts to see the bar drop. But nothing new is owed, and you can refill it.', fx: { saved: -100, wallet: -50, calm: 5 }, next: 'finale', wise: true },
      { label: 'Pay later for the repair', result: 'Fixed the same day. Another plan joins the pile.', fx: { debt: 150, calm: -6 }, next: 'crunch' },
      { label: 'Borrow from a friend', result: 'They say yes straight away. You promise to pay it back by next Friday.', fx: { debt: 150, calm: -2, joy: -4 }, next: 'finale' },
    ],
  },
  {
    id: 'crunch',
    title: 'The tight week',
    text: 'More is leaving than coming in. You are about $60 short before the next paycheck.',
    choices: [
      { label: 'Message providers and spread the dates', result: 'Two of them move a payment by a week. You make it through.', fx: { calm: 8 }, next: 'finale', wise: true },
      { label: 'Pause all new spending for two weeks', result: 'Boring dinners and free evenings. The week closes at zero, not below it.', fx: { wallet: 60, debt: -60, joy: -8, calm: 6 }, next: 'finale', wise: true },
      { label: 'Take a cash advance', result: '$200 arrives in minutes. $240 is due back.', fx: { wallet: 200, debt: 240, calm: -15 }, next: 'finale' },
    ],
  },
  {
    id: 'finale',
    title: 'Three months later',
    text: 'A quiet Sunday. You look back at the last few months and decide what happens next.',
    choices: [
      { label: 'Send $25 a week to your goal, automatically', result: 'You set it once. A month on, you have stopped noticing it leave.', fx: { saved: 100, calm: 10 }, next: 'end', wise: true },
      { label: 'Plan one treat a month, guilt-free', result: 'One thing to look forward to, already paid for.', fx: { joy: 12, wallet: -40 }, next: 'end' },
      { label: 'Figure it out later', result: 'Later arrives on a Tuesday, the same as always.', fx: { calm: -5 }, next: 'end' },
    ],
  },
]

export const STORY: Record<string, StoryNode> = Object.fromEntries(NODES.map((n) => [n.id, n]))
