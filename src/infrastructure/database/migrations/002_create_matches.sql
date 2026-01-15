CREATE TYPE match_status AS ENUM ('waiting', 'in_progress', 'completed', 'cancelled');
CREATE TYPE game_result AS ENUM ('player1_win', 'player2_win', 'draw');

CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    player2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status match_status NOT NULL DEFAULT 'waiting',
    current_turn UUID NOT NULL,
    moves JSONB DEFAULT '[]'::jsonb,
    result game_result,
    winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_matches_player1 ON matches(player1_id);
CREATE INDEX idx_matches_player2 ON matches(player2_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_created_at ON matches(created_at DESC);