CREATE VIEW "user_stats" AS
    SELECT
        u.id as id,
        COUNT(1) as "totalPastesCount",
        (
            SELECT json_agg(
                    json_build_object(language, count)
                ) from (
                    select language, count(1) from pastes where "authorId" = u.id group by language
                ) langs_count
        ) as langs
    FROM users u
    JOIN pastes p
    ON u.id = p."authorId"
    GROUP BY u.id;
