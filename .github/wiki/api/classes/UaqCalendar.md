[**temporal-hijri v1.0.1**](../README.md)

***

[temporal-hijri](../README.md) / UaqCalendar

# Class: UaqCalendar

Defined in: [src/calendars/UaqCalendar.ts:16](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/UaqCalendar.ts#L16)

Temporal calendar implementation for the Umm al-Qura calendar.

Umm al-Qura is the official calendar of Saudi Arabia, maintained by the
King Abdulaziz City for Science and Technology (KACST). It is the most
widely used Hijri calendar standard for civil and religious purposes across
the Muslim world. Month boundaries are determined by pre-calculated tables
rather than real-time moon sighting.

Calendar engine: hijri-core UAQ (table-driven, covers 1318-1500 AH).
Calendar ID: "hijri-uaq"

## Extends

- [`HijriCalendar`](HijriCalendar.md)

## Constructors

### Constructor

> **new UaqCalendar**(): `UaqCalendar`

Defined in: [src/calendars/UaqCalendar.ts:17](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/UaqCalendar.ts#L17)

#### Returns

`UaqCalendar`

#### Overrides

[`HijriCalendar`](HijriCalendar.md).[`constructor`](HijriCalendar.md#constructor)

## Properties

### id

> `readonly` **id**: `string`

Defined in: [src/calendars/HijriCalendar.ts:59](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L59)

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`id`](HijriCalendar.md#id)

## Methods

### dateAdd()

> **dateAdd**(`date`, `duration`, `_options?`): `PlainDate`

Defined in: [src/calendars/HijriCalendar.ts:346](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L346)

Add a duration to a Hijri date.

Year and month additions are handled in Hijri space to preserve calendar
semantics (e.g., adding one month to 1 Ramadan yields 1 Shawwal, not a
fixed 30-day offset). Day and week additions are then applied in ISO space
so that they always represent exact day counts.

Month normalization uses O(1) modular arithmetic instead of iterative loops.
When the day-of-month exceeds the target month's length after a Hijri-space
adjustment, it is clamped to the last valid day of that month.

#### Parameters

##### date

`PlainDate`

##### duration

`Duration`

##### \_options?

###### overflow?

`"constrain"` \| `"reject"`

#### Returns

`PlainDate`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`dateAdd`](HijriCalendar.md#dateadd)

***

### dateFromFields()

> **dateFromFields**(`fields`, `options?`): `PlainDate`

Defined in: [src/calendars/HijriCalendar.ts:279](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L279)

#### Parameters

##### fields

###### day

`number`

###### month

`number`

###### year

`number`

##### options?

###### overflow?

`"constrain"` \| `"reject"`

#### Returns

`PlainDate`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`dateFromFields`](HijriCalendar.md#datefromfields)

***

### dateUntil()

> **dateUntil**(`one`, `two`, `options?`): `Duration`

Defined in: [src/calendars/HijriCalendar.ts:384](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L384)

Compute the difference between two Hijri dates.

For simplicity and correctness across variable-length Hijri months, this
delegates to the underlying ISO PlainDate difference when the largest unit
is days or weeks. Year/month differences require a Hijri-space calculation.

#### Parameters

##### one

`PlainDate`

##### two

`PlainDate`

##### options?

###### largestUnit?

`DateUnit`

#### Returns

`Duration`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`dateUntil`](HijriCalendar.md#dateuntil)

***

### day()

> **day**(`date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:169](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L169)

Returns the day of the Hijri month (1-29 or 1-30).

#### Parameters

##### date

`PlainDate`

A Temporal.PlainDate with ISO (Gregorian) coordinates.

#### Returns

`number`

Day of month within the Hijri calendar.

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`day`](HijriCalendar.md#day)

***

### dayOfWeek()

> **dayOfWeek**(`date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:234](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L234)

ISO weekday: 1 = Monday, 7 = Sunday.
PlainDate.dayOfWeek on an ISO-calendar date already gives ISO weekday,
so no conversion is needed.

#### Parameters

##### date

`PlainDate`

#### Returns

`number`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`dayOfWeek`](HijriCalendar.md#dayofweek)

***

### dayOfYear()

> **dayOfYear**(`date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:242](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L242)

Day within the Hijri year. Accumulates full months before the current one,
then adds the day-of-month offset.

#### Parameters

##### date

`PlainDate`

#### Returns

`number`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`dayOfYear`](HijriCalendar.md#dayofyear)

***

### daysInMonth()

> **daysInMonth**(`date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:184](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L184)

Returns the number of days in the Hijri month containing the given date.

Hijri months alternate between 29 and 30 days, but the exact pattern
differs by calendar system (UAQ uses fixed tables; FCNA uses calculation).

#### Parameters

##### date

`PlainDate`

A Temporal.PlainDate with ISO (Gregorian) coordinates.

#### Returns

`number`

29 or 30.

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`daysInMonth`](HijriCalendar.md#daysinmonth)

***

### daysInWeek()

> **daysInWeek**(`_date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:263](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L263)

Returns the number of days in a week.

Always 7. Required by the Temporal Calendar Protocol.

#### Parameters

##### \_date

`PlainDate`

#### Returns

`number`

Always 7.

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`daysInWeek`](HijriCalendar.md#daysinweek)

***

### daysInYear()

> **daysInYear**(`date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:193](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L193)

Sum all 12 month lengths for the Hijri year. Standard lunar years are 354
days; leap years (with an added day in Dhul-Hijja) are 355 days.

#### Parameters

##### date

`PlainDate`

#### Returns

`number`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`daysInYear`](HijriCalendar.md#daysinyear)

***

### fields()

> **fields**(`fields`): `string`[]

Defined in: [src/calendars/HijriCalendar.ts:273](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L273)

Return the list of fields that the calendar adds to a Temporal object.
Non-era calendars return the input array unchanged.

#### Parameters

##### fields

`string`[]

#### Returns

`string`[]

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`fields`](HijriCalendar.md#fields)

***

### inLeapYear()

> **inLeapYear**(`date`): `boolean`

Defined in: [src/calendars/HijriCalendar.ts:223](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L223)

Returns whether the Hijri year is a leap year (355 days).

Standard Hijri years have 354 days. A leap year adds one day to
Dhul-Hijja (month 12), making it 355 days total.

#### Parameters

##### date

`PlainDate`

A Temporal.PlainDate with ISO (Gregorian) coordinates.

#### Returns

`boolean`

`true` if the year has 355 days.

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`inLeapYear`](HijriCalendar.md#inleapyear)

***

### mergeFields()

> **mergeFields**(`fields`, `additionalFields`): `Record`\<`string`, `unknown`\>

Defined in: [src/calendars/HijriCalendar.ts:414](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L414)

#### Parameters

##### fields

`Record`\<`string`, `unknown`\>

##### additionalFields

`Record`\<`string`, `unknown`\>

#### Returns

`Record`\<`string`, `unknown`\>

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`mergeFields`](HijriCalendar.md#mergefields)

***

### month()

> **month**(`date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:149](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L149)

Returns the Hijri month (1-12) for the given ISO date.

#### Parameters

##### date

`PlainDate`

A Temporal.PlainDate with ISO (Gregorian) coordinates.

#### Returns

`number`

Month number 1 (Muharram) through 12 (Dhul-Hijja).

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`month`](HijriCalendar.md#month)

***

### monthCode()

> **monthCode**(`date`): `string`

Defined in: [src/calendars/HijriCalendar.ts:158](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L158)

Month code per the Temporal proposal: "M01".."M12".
Hijri months are always 1-12 (no leap/intercalary month), so the code is
simply the zero-padded month number.

#### Parameters

##### date

`PlainDate`

#### Returns

`string`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`monthCode`](HijriCalendar.md#monthcode)

***

### monthDayFromFields()

> **monthDayFromFields**(`fields`, `options?`): `PlainMonthDay`

Defined in: [src/calendars/HijriCalendar.ts:317](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L317)

ISO-anchored PlainMonthDay per the Temporal Calendar Protocol.
Reference year 1444 is intentional: it is a recent, well-covered UAQ year
used to anchor the ISO coordinates when no year is supplied.

#### Parameters

##### fields

###### day

`number`

###### month

`number`

###### year?

`number`

##### options?

###### overflow?

`"constrain"` \| `"reject"`

#### Returns

`PlainMonthDay`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`monthDayFromFields`](HijriCalendar.md#monthdayfromfields)

***

### monthsInYear()

> **monthsInYear**(`_date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:210](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L210)

Returns the number of months in the Hijri year.

Always 12. Unlike the Hebrew calendar, the Hijri lunar calendar has no
intercalary (leap) month — only a possible extra day in Dhul-Hijja.

#### Parameters

##### \_date

`PlainDate`

#### Returns

`number`

Always 12.

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`monthsInYear`](HijriCalendar.md#monthsinyear)

***

### toString()

> **toString**(): `string`

Defined in: [src/calendars/HijriCalendar.ts:66](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L66)

#### Returns

`string`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`toString`](HijriCalendar.md#tostring)

***

### weekOfYear()

> **weekOfYear**(`date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:252](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L252)

Hijri week number counted from day 1 of Muharram (day 1-7 = week 1). No ISO week alignment.

#### Parameters

##### date

`PlainDate`

#### Returns

`number`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`weekOfYear`](HijriCalendar.md#weekofyear)

***

### year()

> **year**(`date`): `number`

Defined in: [src/calendars/HijriCalendar.ts:139](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L139)

Returns the Hijri year for the given ISO date.

#### Parameters

##### date

`PlainDate`

A Temporal.PlainDate with ISO (Gregorian) coordinates.

#### Returns

`number`

The Hijri year, e.g. 1444.

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`year`](HijriCalendar.md#year)

***

### yearMonthFromFields()

> **yearMonthFromFields**(`fields`, `options?`): `PlainYearMonth`

Defined in: [src/calendars/HijriCalendar.ts:294](https://github.com/acamarata/temporal-hijri/blob/cdcede1c5890a670cd9f06a043e3a796fbd69b10/src/calendars/HijriCalendar.ts#L294)

ISO-anchored PlainYearMonth per the Temporal Calendar Protocol.
The resulting PlainYearMonth stores ISO coordinates internally, representing
the Hijri month that starts on that ISO year/month.

#### Parameters

##### fields

###### month

`number`

###### year

`number`

##### options?

###### overflow?

`"constrain"` \| `"reject"`

#### Returns

`PlainYearMonth`

#### Inherited from

[`HijriCalendar`](HijriCalendar.md).[`yearMonthFromFields`](HijriCalendar.md#yearmonthfromfields)
