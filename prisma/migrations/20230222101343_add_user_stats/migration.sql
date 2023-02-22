-- This is an empty migration.

CREATE MATERIALIZED VIEW user_stats AS
    SELECT
        u.id AS id,
        (SELECT COUNT(1) FROM pastes p WHERE u.id = p."authorId") AS "totalPastesCount",
        (
            SELECT JSON_OBJECT_AGG(ext, ext_count)
            FROM (
                    SELECT
                        SPLIT_PART(f.name, '.', -1) AS ext,
                        count(1) AS ext_count
                    FROM pastes p
                    JOIN files f ON p.id = f."pasteId"
                    WHERE p."authorId" = u.id
                    GROUP BY SPLIT_PART(f.name, '.', -1)
            ) AS extension_count
        ) AS langs
    FROM users u
WITH DATA;
