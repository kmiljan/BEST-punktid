<?php

function getDateFromReferenceData(string $referenceData): DateTime|null
{
    $referenceData = ReferenceData::fromName($referenceData);

    return match ($referenceData) {
        ReferenceData::totalScore => getMinStartDate(),
        ReferenceData::totalScoreThisMonth => getMonthStartDate(),
        ReferenceData::totalScoreThisSeason => getSeasonStartDate(),
        default => null,
    };
}

enum ReferenceData
{
    case totalScore;
    case totalScoreThisSeason;
    case totalScoreThisMonth;

    public static function fromName(string $name): ReferenceData|null
    {
        foreach (self::cases() as $status) {
            if ($name === $status->name) {
                return $status;
            }
        }

        return null;
    }
}