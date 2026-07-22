#!/usr/bin/env python3
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import server
import notebooklm_service
import step_ai_service


class FakeHandler:
    headers = {"Host": "fanphysics.test"}


class NotebookLMServiceTests(unittest.TestCase):
    def test_notebook_url_is_normalized_to_notebook(self):
        value = notebooklm_service.normalize_notebooklm_url(
            "https://notebooklm.google.com/notebook/example-id/artifact/example"
        )
        self.assertEqual(value, "https://notebooklm.google.com/notebook/example-id")
        self.assertEqual(notebooklm_service.normalize_notebooklm_url("https://example.com/notebook/x"), "")

    def test_catalog_and_pages_render_after_module_split(self):
        catalog = notebooklm_service.load_problem_catalog()
        self.assertGreater(len(catalog), 0)
        directory = notebooklm_service.render_notebooklm_index(FakeHandler(), catalog)
        self.assertIn("独立课例地址", directory)
        problem_id, problem = catalog[0]
        lesson = notebooklm_service.render_problem_page(FakeHandler(), problem_id, problem)
        self.assertIn(problem.get("title") or problem_id, lesson)


class StepAiServiceTests(unittest.TestCase):
    def test_message_builder_keeps_context_and_latex_rule(self):
        messages = step_ai_service.build_step_ai_messages(
            {
                "assistantSubject": "physics",
                "problemId": "test-problem",
                "stepTitle": "列式",
                "stepContent": "使用机械能守恒",
                "conversationHistory": [
                    {"role": "user", "content": "为什么守恒？"},
                    {"role": "assistant", "content": "因为只有保守力做功。"},
                ],
                "userQuestion": "下一步是什么？",
            }
        )
        self.assertEqual(messages[-1], {"role": "user", "content": "下一步是什么？"})
        self.assertEqual(messages[1]["content"], "为什么守恒？")
        self.assertIn("LaTeX", messages[0]["content"])
        self.assertIn("test-problem", messages[0]["content"])

    def test_server_imports_split_services(self):
        self.assertIs(server.call_deepseek, step_ai_service.call_deepseek)
        self.assertIs(server.load_problem_catalog, notebooklm_service.load_problem_catalog)


if __name__ == "__main__":
    unittest.main()
