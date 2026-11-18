import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
import check_kit as c  # noqa: E402


class Scan(unittest.TestCase):
    def test_clean(self):
        self.assertEqual(c.scan_text("A plain sentence about footage."), [])

    def test_private_link(self):
        self.assertIn("private storage link", c.scan_text("see https://drive.google.com/x"))

    def test_local_path(self):
        self.assertIn("local path", c.scan_text("/Users/someone/project"))

    def test_email(self):
        self.assertIn("email address", c.scan_text("write to a.b@example.com"))

    def test_dash(self):
        self.assertIn("em or en dash", c.scan_text("one — two"))


class Kit(unittest.TestCase):
    def test_kit_is_complete_and_clean(self):
        self.assertEqual(c.check(), [])


if __name__ == "__main__":
    unittest.main()
