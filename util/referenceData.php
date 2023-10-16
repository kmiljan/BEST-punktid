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
