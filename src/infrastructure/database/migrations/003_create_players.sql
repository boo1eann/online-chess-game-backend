CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL DEFAULT 1000,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    total_matches INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    experience INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_rating CHECK (rating >= 0),
    CONSTRAINT positive_wins CHECK (wins >= 0),
    CONSTRAINT positive_losses CHECK (losses >= 0),
    CONSTRAINT positive_draws CHECK (draws >= 0),
    CONSTRAINT positive_level CHECK (level >= 1),
    CONSTRAINT positive_experience CHECK (experience >= 0)
);

CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_players_rating ON players(rating DESC);
CREATE INDEX idx_players_level ON players(level DESC);