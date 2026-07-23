#!/usr/bin/env python3
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import server
import model_system_service
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

    def test_notebook_page_includes_taxonomy_and_exam_connections(self):
        catalog = notebooklm_service.load_problem_catalog()
        problem_id, problem = next(
            item for item in catalog if item[0] == "required2_single_10_orbit_transfer"
        )
        lesson = notebooklm_service.render_problem_page(FakeHandler(), problem_id, problem)
        self.assertIn("学习定位", lesson)
        self.assertIn("真题拓展", lesson)
        self.assertIn("霍曼转移轨道与空间交会", lesson)


class ModelSystemServiceTests(unittest.TestCase):
    def test_model_map_and_progression_are_generated_from_problem_taxonomy(self):
        catalog = notebooklm_service.load_problem_catalog()
        grouped = model_system_service.group_model_catalog(catalog)
        self.assertIn("energy-conservation", grouped)
        self.assertIn("potential-reference", grouped["energy-conservation"]["families"])
        index = model_system_service.render_model_system_index(catalog)
        detail = model_system_service.render_model_system_detail("energy-conservation", catalog)
        self.assertIn("物理模型图谱", index)
        self.assertIn("重力势能参考面", detail)
        self.assertIn("打开动画题目", detail)


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
        self.assertIs(server.render_model_system_index, model_system_service.render_model_system_index)


if __name__ == "__main__":
    unittest.main()
