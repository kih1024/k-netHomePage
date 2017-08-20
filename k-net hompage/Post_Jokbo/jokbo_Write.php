<!--
	made by Yang Ji Yong
	made at 2017-07-30
	View Notice_List
-->

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="./jokbo_Write.css">
	<title>K-net 홈페이지 족보 게시판 글쓰기</title>
</head>
<body>
	<!-- 전체 div -->
	<div id="main_border_div_id">
		<!-- 실제 화면 div -->
		<div id="wrapper_div_id">
			<div id="top_div_id">
				<div class="top_div_class">
					top
				</div>
			</div>

			<!-- 중앙 div -->
			<div id="center_div_id">
				<!-- 중앙게시글 div -->
				<div class="center_div_class">
					<!-- 중앙게시글View table div -->
					<div id="postW_div_id">
						<form method="post" id="post_list_form_id">
							<table>
								<!-- table head -->
								<thead><tr></tr></thead>

								<!-- table end -->
								<tfoot><tr></tr></tfoot>

								<!-- table body -->
								<!-- 이후 반복문을 통해 tr태그 생성 -->
								<tbody>
									<!-- 제목 -->
									<tr>
										<td>
											<div class="postW_div_class">
												<span>title</span><br>
												<input type="textbox" id="postW_head_input_id">
											</div>
										</td>
									</tr>

									<!-- 글 내용 -->
									<tr>
										<td>
											<div class="postW_div_class">
												<span>content</span><br>
												<input type="textbox" id="postW_content_input_id">
											</div>
										</td>
									</tr>

									<!-- 동영상 링크_1 -->
									<tr>
										<td>
											<div class="postW_div_class">
												<span>video_1</span><br>
												<input type="textbox" id="postW_video_input_1_id">
												<span><a class="a_class" style="margin-left:60px" href="#">Plus</a></span>
											</div>
										</td>
									</tr>

									<!-- 동영상 링크_2 -->
									<tr>
										<td>
											<div class="postW_div_class">
												<span>video_2</span><br>
												<input type="textbox" id="postW_video_input_2_id">
												<span><a class="a_class" style="margin-left:60px" href="#">Plus</a></span>
											</div>
										</td>
									</tr>

									<!-- 첨부파일 -->
									<tr>
										<td>
											<div id="postW_head_class">
												<span>add_file</span><br>
												<input type="textbox" id="postW_file_input_id">
												<span><a class="a_class" style="margin-left:60px" href="#">Plus</a></span>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</form>
					</div>
				</div>

				<div id="postW_btn_div_id">
					<table>
						<tbody>
							<tr>
								<td>
									<span><a class="a_class" href="#">등록</a></span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</body>
</html>