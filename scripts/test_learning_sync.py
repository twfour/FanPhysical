#!/usr/bin/env python3
import tempfile
import time
import unittest
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import server


class LearningSyncTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.original_path = server.LEARNING_STATE_PATH
        self.original_password = server.NOTEBOOKLM_EDIT_PASSWORD
        self.original_enabled = server.NOTEBOOKLM_EDIT_ENABLED
        server.LEARNING_STATE_PATH = Path(self.temporary_directory.name) / "learning-state.json"
        server.NOTEBOOKLM_EDIT_PASSWORD = "fanphysics-test-password"
        server.NOTEBOOKLM_EDIT_ENABLED = True

    def tearDown(self):
        server.LEARNING_STATE_PATH = self.original_path
        server.NOTEBOOKLM_EDIT_PASSWORD = self.original_password
        server.NOTEBOOKLM_EDIT_ENABLED = self.original_enabled
        self.temporary_directory.cleanup()

    def test_newer_record_and_tombstone_win(self):
        current = {
            "stores": {
                "exploration": {
                    "problem:stage:0": {"value": "旧回答", "updatedAt": 100, "deleted": False},
                },
            },
        }
        incoming = {
            "stores": {
                "exploration": {
                    "problem:stage:0": {"value": "新回答", "updatedAt": 200, "deleted": False},
                    "problem:stage:1": {"value": "", "updatedAt": 300, "deleted": True},
                },
            },
        }
        merged = server.merge_learning_states(current, incoming)
        self.assertEqual(merged["stores"]["exploration"]["problem:stage:0"]["value"], "新回答")
        self.assertTrue(merged["stores"]["exploration"]["problem:stage:1"]["deleted"])

    def test_state_round_trip_keeps_three_point_score(self):
        payload = {
            "stores": {
                "realLife": {
                    "problem:real-life": {"value": "迁移回答", "updatedAt": 400, "deleted": False},
                },
                "realLifeChecks": {
                    "problem:real-life": {"value": [2, 0, 2], "updatedAt": 500, "deleted": False},
                },
            },
        }
        server.save_learning_state(payload)
        loaded = server.load_learning_state()
        self.assertEqual(loaded["stores"]["realLife"]["problem:real-life"]["value"], "迁移回答")
        self.assertEqual(loaded["stores"]["realLifeChecks"]["problem:real-life"]["value"], [0, 2])

    def test_signed_session_cookie_is_accepted(self):
        token = server.create_learning_session_token()

        class Handler:
            headers = {"Cookie": f"{server.LEARNING_SESSION_COOKIE}={token}"}

        self.assertTrue(server.learning_session_is_valid(Handler()))
        payload = f"{int(time.time()) - 1}.expired"
        expired = f"{payload}.{server.learning_session_signature(payload)}"
        Handler.headers = {"Cookie": f"{server.LEARNING_SESSION_COOKIE}={expired}"}
        self.assertFalse(server.learning_session_is_valid(Handler()))


if __name__ == "__main__":
    unittest.main()
